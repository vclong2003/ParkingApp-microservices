package com.parknexus.ParkingLotService.repository.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.form.GetParkingLotsForm;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;

public class ParkingLotSpecifications {
    public static Specification<ParkingLot> filterByForm(GetParkingLotsForm form, Integer currentUserId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // name
            if (form.getName() != null && !form.getName().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + form.getName().toLowerCase() + "%"));
            }

            // status
            if (form.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), form.getStatus()));
            }

            // isApproved
            if (form.getIsApproved() != null) {
                predicates.add(cb.equal(root.get("isApproved"), form.getIsApproved()));
            }

            // isMine
            if (Boolean.TRUE.equals(form.getIsMine()) && currentUserId != null) {
                predicates.add(cb.equal(root.get("ownerId"), currentUserId));
            }
            if (Boolean.FALSE.equals(form.getIsMine())) {
                predicates.add(cb.notEqual(root.get("ownerId"), currentUserId));
            }

            // longitude, latitude
            if (form.getLatitude() != null && form.getLongitude() != null && form.getRadiusInKm() != null) {
                double radiusInMeters = form.getRadiusInKm() * 1000.0;

                Expression<Double> distanceInMeters = cb.function(
                        "ST_Distance_Sphere",
                        Double.class,
                        cb.function("POINT", Object.class, cb.literal(form.getLongitude()),
                                cb.literal(form.getLatitude())),
                        cb.function("POINT", Object.class, root.get("longitude"), root.get("latitude")));

                predicates.add(cb.lessThanOrEqualTo(distanceInMeters, radiusInMeters));
            }

            // Exclude Soft-Deleted Records
            predicates.add(cb.isNull(root.get("deletedAt")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
