package com.parknexus.ReservationService.dto;

import com.parknexus.ReservationService.entity.Reservation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateReservationResultDto {
    private Reservation reservation;
    private ParkingLotDto parkingLotDto;
    private VehicleDto vehicleDto;
    private ParkingSpotDto parkingSpotDto;
}
