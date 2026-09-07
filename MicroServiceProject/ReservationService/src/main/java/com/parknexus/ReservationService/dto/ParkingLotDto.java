package com.parknexus.ReservationService.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

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
    private String description;
    private Double latitude;
    private Double longitude;
    private List<String> mediaUrls;
    private LocalTime openAt;
    private LocalTime closeAt;
    private String status;
    private Boolean isApproved;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private List<ParkingLotPriceDto> prices;
}
