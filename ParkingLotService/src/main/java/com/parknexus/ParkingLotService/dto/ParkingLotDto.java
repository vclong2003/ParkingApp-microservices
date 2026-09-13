package com.parknexus.ParkingLotService.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.entity.ParkingLotPrice;
import com.parknexus.ParkingLotService.enums.ParkingLotStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLotDto {
    private Integer id;
    private Integer ownerId;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private List<String> mediaUrls = new ArrayList<>();
    private LocalTime openAt;
    private LocalTime closeAt;
    private ParkingLotStatus status = ParkingLotStatus.Inactive;
    private Boolean isApproved;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private List<ParkingLotPrice> prices = new ArrayList<>();

    public ParkingLotDto(ParkingLot entity) {
        this.id = entity.getId();
        this.ownerId = entity.getOwnerId();
        this.name = entity.getName();
        this.description = entity.getDescription();
        this.latitude = entity.getLatitude();
        this.longitude = entity.getLongitude();
        this.mediaUrls = entity.getMediaUrls();
        this.openAt = entity.getOpenAt();
        this.closeAt = entity.getCloseAt();
        this.status = entity.getStatus();
        this.isApproved = entity.getIsApproved();
        this.approvedAt = entity.getApprovedAt();
        this.createdAt = entity.getApprovedAt();
        this.updatedAt = entity.getUpdatedAt();
        this.deletedAt = entity.getDeletedAt();
        this.prices = entity.getPrices();
    }
}
