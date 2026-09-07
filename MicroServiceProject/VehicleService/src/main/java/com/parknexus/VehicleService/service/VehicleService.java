package com.parknexus.VehicleService.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.parknexus.Common.util.ObjectUtils;
import com.parknexus.VehicleService.entity.Vehicle;
import com.parknexus.VehicleService.form.CreateVehicleForm;
import com.parknexus.VehicleService.form.UpdateVehicleForm;
import com.parknexus.VehicleService.repository.IVehicleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleService {
    private final IVehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles(Integer userId) {
        List<Vehicle> vehicles = vehicleRepository.findAllByOwnerId(userId);
        return vehicles;
    }

    public Vehicle getVehicleById(Integer vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        return vehicle;

    }

    public Vehicle createVehicle(Integer userId, CreateVehicleForm form) {
        vehicleRepository.findByPlate(form.getPlate()).ifPresent(v -> {
            throw new IllegalArgumentException("Plate already exists");
        });

        Vehicle vehicle = new Vehicle();
        BeanUtils.copyProperties(form, vehicle);
        vehicle.setOwnerId(userId);

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Integer vehicleId, Integer userId, UpdateVehicleForm form) {
        Vehicle vehicle = vehicleRepository.findByIdAndOwnerId(vehicleId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        if (form.getPlate() != null) {
            vehicleRepository.findByPlate(form.getPlate()).filter(v -> !v.getId().equals(vehicleId)).ifPresent(v -> {
                throw new IllegalArgumentException("Plate already exists");
            });
        }

        String[] notUpdatedFields = ObjectUtils.getNullPropertyNames(form);
        BeanUtils.copyProperties(form, vehicle, notUpdatedFields);
        return vehicleRepository.save(vehicle);
    }

}
