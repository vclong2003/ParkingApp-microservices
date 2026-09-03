package com.parknexus.ParkingLotService.dto;

import java.time.LocalDateTime;

import com.parknexus.ParkingLotService.entity.ParkingSpot;
import com.parknexus.ParkingLotService.enums.VehicleType;

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
    private VehicleType vehicleType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ParkingSpotDto(ParkingSpot entity) {
        this.id = entity.getId();
        this.vehicleType = entity.getVehicleType();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}
