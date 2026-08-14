package com.parknexus.ReservationService.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.ReservationService.dto.ReservationDto;
import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.service.ReservationService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController()
@RequestMapping("api/v1/reservations")
@CrossOrigin("*")
@AllArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @GetMapping()
    public ResponseEntity<List<ReservationDto>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        List<ReservationDto> reservationDtos = reservations.stream().map(reservation -> new ReservationDto(reservation))
                .toList();

        return new ResponseEntity<>(reservationDtos, HttpStatus.OK);
    }

}
