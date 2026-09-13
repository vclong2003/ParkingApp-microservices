package com.parknexus.ParkingLotService.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.parknexus.Common.annotation.RequireRole;
import com.parknexus.Common.config.FeignConfig;
import com.parknexus.ParkingLotService.dto.ReservationDto;
import com.parknexus.ParkingLotService.form.GetReservationsForm;

import jakarta.validation.Valid;

@FeignClient(name = "ReservationService", path = "api/v1/reservations", configuration = FeignConfig.class)
public interface IReservationServiceClient {
    @RequireRole({})
    @GetMapping("/all")
    public List<ReservationDto> getReservations(@ModelAttribute @Valid GetReservationsForm form);
}
