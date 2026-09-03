package com.parknexus.ReservationService.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Integer id;
    private Integer parkingSpotId;
    private Integer vehicleId;
    private Integer userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal totalPrice;
    private ReservationStatus status = ReservationStatus.Pending;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReservationDto(Reservation entity) {
        this.id = entity.getId();
        this.parkingSpotId = entity.getParkingSpotId();
        this.vehicleId = entity.getVehicleId();
        this.userId = entity.getUserId();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.totalPrice = entity.getTotalPrice();
        this.status = entity.getStatus();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}
