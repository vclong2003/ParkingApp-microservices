package com.parknexus.ReservationService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.parknexus.Common.config.FeignConfig;
import com.parknexus.ReservationService.dto.ParkingLotDto;
import com.parknexus.ReservationService.dto.ParkingSpotDto;
import com.parknexus.ReservationService.enums.ParkingSpotStatus;

@FeignClient(name = "ParkingLotService", path = "/api/v1/parkingLots", configuration = FeignConfig.class)
public interface IParkingLotServiceClient {
    @GetMapping("/{lotId}")
    public ParkingLotDto getParkingLot(@PathVariable Integer lotId);

    @GetMapping("/{lotId}/spots/{spotId}")
    public ParkingSpotDto getParkingSpot(@PathVariable Integer lotId, @PathVariable Integer spotId);

    @PutMapping("/{lotId}/spots/{spotId}/status")
    public ParkingSpotDto updateParkingSpotStatus(@PathVariable Integer lotId,
            @PathVariable Integer spotId, @RequestParam ParkingSpotStatus status);
}
