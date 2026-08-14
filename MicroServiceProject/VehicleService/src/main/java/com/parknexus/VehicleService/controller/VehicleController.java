package com.parknexus.VehicleService.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.VehicleService.dto.VehicleDto;
import com.parknexus.VehicleService.entity.Vehicle;
import com.parknexus.VehicleService.service.VehicleService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("api/v1/vehicles")
@CrossOrigin("*")
@AllArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping()
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        List<VehicleDto> vehicleDtos = vehicles.stream().map(VehicleDto::new).toList();

        return new ResponseEntity<>(vehicleDtos, HttpStatus.OK);
    }

}
