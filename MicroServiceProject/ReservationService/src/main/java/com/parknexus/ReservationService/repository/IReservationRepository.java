package com.parknexus.ReservationService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ReservationStatus;

public interface IReservationRepository extends JpaRepository<Reservation, Integer> {
    public List<Reservation> findByUserId(Integer userId);

    public long countByUserIdAndStatus(Integer userId, ReservationStatus status);
}
