package com.parknexus.ReservationService.dto;

import java.util.List;

import com.parknexus.ReservationService.enums.VehicleType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AvailableSpotsAndTypesDto {
    private List<ParkingSpotDto> availableSpots;
    private List<VehicleType> availableVehicleTypes;
}
