package com.parknexus.ReservationService.repository.specification;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ReservationStatus;

import jakarta.persistence.criteria.Predicate;

public class ReservationSpecifications {
    public static Specification<Reservation> filter(Integer parkingLotId, LocalDateTime startTime,
            LocalDateTime endTime, List<ReservationStatus> excludedStatuses, Integer userId, Integer vehicleId,
            Integer spotId, List<ReservationStatus> includedStatuses) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new java.util.ArrayList<>();
            if (parkingLotId != null) {
                predicates.add(criteriaBuilder.equal(root.get("parkingLotId"), parkingLotId));
            }
            if (startTime != null && endTime == null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startTime"), startTime));
            }
            if (endTime != null && startTime == null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endTime"), endTime));
            }
            if (startTime != null && endTime != null) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.between(root.get("startTime"), startTime, endTime),
                        criteriaBuilder.between(root.get("endTime"), startTime, endTime),
                        criteriaBuilder.and(
                                criteriaBuilder.lessThanOrEqualTo(root.get("startTime"), startTime),
                                criteriaBuilder.greaterThanOrEqualTo(root.get("endTime"), endTime))));
            }
            if (excludedStatuses != null && !excludedStatuses.isEmpty()) {
                predicates.add(criteriaBuilder.not(root.get("status").in(excludedStatuses)));
            }
            if (includedStatuses != null && !includedStatuses.isEmpty()) {
                predicates.add(root.get("status").in(includedStatuses));
            }
            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), userId));
            }
            if (vehicleId != null) {
                predicates.add(criteriaBuilder.equal(root.get("vehicleId"), vehicleId));
            }
            if (spotId != null) {
                predicates.add(criteriaBuilder.equal(root.get("spotId"), spotId));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
