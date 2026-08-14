package com.parknexus.ReservationService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.ReservationService.entity.Reservation;

public interface IReservationRepository extends JpaRepository<Reservation, Integer> {

}
