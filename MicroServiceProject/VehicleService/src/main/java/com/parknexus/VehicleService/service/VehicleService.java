package com.parknexus.VehicleService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parknexus.VehicleService.entity.Vehicle;
import com.parknexus.VehicleService.repository.IVehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final IVehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
}
