package com.parknexus.ReservationService.repository.specification;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ReservationStatus;

import jakarta.persistence.criteria.Predicate;

public class ReservationSpecifications {
    public static Specification<Reservation> filter(Integer parkingLotId, LocalDateTime startTime,
            LocalDateTime endTime, List<ReservationStatus> excludedStatuses) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new java.util.ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("parkingLotId"), parkingLotId));
            if (startTime != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startTime"), startTime));
            }
            if (endTime != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endTime"), endTime));
            }
            if (excludedStatuses != null && !excludedStatuses.isEmpty()) {
                predicates.add(criteriaBuilder.not(root.get("status").in(excludedStatuses)));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
