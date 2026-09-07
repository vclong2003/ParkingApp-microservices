package com.parknexus.ReservationService.dto;

import java.time.LocalDateTime;

import com.parknexus.ReservationService.enums.ParkingSpotStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParkingSpotDto {
    private Integer id;
    private String vehicleType;
    private ParkingSpotStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
