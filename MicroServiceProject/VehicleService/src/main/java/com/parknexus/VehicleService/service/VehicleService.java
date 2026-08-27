package com.parknexus.VehicleService.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.parknexus.Common.util.ObjectUtils;
import com.parknexus.VehicleService.client.IUserServiceClient;
import com.parknexus.VehicleService.dto.UserDto;
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
    private final IUserServiceClient userServiceClient;

    public List<Vehicle> getAllVehicles(Integer accountId) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);
        List<Vehicle> vehicles = vehicleRepository.findAllByOwnerId(user.getId());
        return vehicles;
    }

    public Vehicle createVehicle(Integer accountId, CreateVehicleForm form) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);

        vehicleRepository.findByPlate(form.getPlate()).ifPresent(v -> {
            throw new IllegalArgumentException("Plate already exists");
        });

        Vehicle vehicle = new Vehicle();
        BeanUtils.copyProperties(form, vehicle);
        vehicle.setOwnerId(user.getId());

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Integer vehicleId, Integer accountId, UpdateVehicleForm form) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);

        Vehicle vehicle = vehicleRepository.findByIdAndOwnerId(vehicleId, user.getId())
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
