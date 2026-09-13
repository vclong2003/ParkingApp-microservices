package com.parknexus.ReservationService.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.parknexus.ReservationService.enums.VehicleType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLotPriceDto {
    private VehicleType vehicleType;
    private BigDecimal price;
    private LocalDateTime updatedAt;
}
