package com.parknexus.ParkingLotService.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.parknexus.ParkingLotService.enums.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Integer id;
    private Integer parkingSpotId;
    private Integer vehicleId;
    private Integer userId;
    private String code;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal pricePerHour;
    private BigDecimal totalPrice;
    private ReservationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private ParkingLotDto parkingLotDto;
    private ParkingSpotDto parkingSpotDto;
    private VehicleDto vehicleDto;
}
