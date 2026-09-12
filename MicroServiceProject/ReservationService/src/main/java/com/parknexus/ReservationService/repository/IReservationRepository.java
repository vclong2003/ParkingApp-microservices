package com.parknexus.ReservationService.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ReservationStatus;

public interface IReservationRepository
        extends JpaRepository<Reservation, Integer>, JpaSpecificationExecutor<Reservation> {
    public List<Reservation> findByUserId(Integer userId);

    public Optional<Reservation> findByIdAndUserId(Integer id, Integer userId);

    public Optional<Reservation> findByCode(String code);

    public long countByUserIdAndStatus(Integer userId, ReservationStatus status);

    public List<Reservation> findByParkingLotIdAndStatus(Integer parkingLotId, ReservationStatus status);
}
