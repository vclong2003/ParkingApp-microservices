package com.parknexus.ReservationService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.parknexus.Common.config.FeignConfig;
import com.parknexus.ReservationService.dto.VehicleDto;

@FeignClient(name = "VehicleService", path = "/api/v1/vehicles", configuration = FeignConfig.class)
public interface IVehicleServiceClient {
    @GetMapping("/{vehicleId}")
    public VehicleDto getVehicleById(@PathVariable Integer vehicleId);
}
