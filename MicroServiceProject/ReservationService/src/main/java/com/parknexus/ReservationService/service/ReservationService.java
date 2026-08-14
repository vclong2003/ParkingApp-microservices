package com.parknexus.ReservationService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.repository.IReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final IReservationRepository reservationRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

}
