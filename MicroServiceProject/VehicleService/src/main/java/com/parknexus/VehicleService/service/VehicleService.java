package com.parknexus.VehicleService.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.parknexus.Common.util.ObjectUtils;
import com.parknexus.VehicleService.client.IStorageServiceClient;
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
    private final IStorageServiceClient storageServiceClient;

    public List<Vehicle> getAllVehicles(Integer userId) {
        List<Vehicle> vehicles = vehicleRepository.findAllByOwnerId(userId);
        List<Vehicle> vehiclesWithSignedUrls = vehicles.stream().map(vehicle -> {
            if (vehicle.getImageUrl() != null) {
                String bucketUrl = vehicle.getImageUrl();
                String signedUrl = storageServiceClient.getSignedUrl(bucketUrl).get("signedUrl");
                vehicle.setImageUrl(signedUrl);
            }
            return vehicle;
        }).toList();
        return vehiclesWithSignedUrls;
    }

    public Vehicle getVehicleById(Integer vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        Vehicle vehicleWithSignedUrl = vehicle;
        if (vehicle.getImageUrl() != null) {
            String bucketUrl = vehicle.getImageUrl();
            String signedUrl = storageServiceClient.getSignedUrl(bucketUrl).get("signedUrl");
            vehicleWithSignedUrl.setImageUrl(signedUrl);
        }

        return vehicleWithSignedUrl;
    }

    public Vehicle createVehicle(Integer userId, CreateVehicleForm form) {
        vehicleRepository.findByPlate(form.getPlate()).ifPresent(v -> {
            throw new IllegalArgumentException("Plate already exists");
        });

        Vehicle vehicle = new Vehicle();
        BeanUtils.copyProperties(form, vehicle);
        vehicle.setOwnerId(userId);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        if (savedVehicle.getImageUrl() != null) {
            String bucketUrl = savedVehicle.getImageUrl();
            storageServiceClient.getSignedUrl(bucketUrl);
        }
        return savedVehicle;
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
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        if (updatedVehicle.getImageUrl() != null) {
            String bucketUrl = updatedVehicle.getImageUrl();
            storageServiceClient.getSignedUrl(bucketUrl);
        }
        return updatedVehicle;
    }

}
