package com.parknexus.VehicleService.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.VehicleService.entity.Vehicle;

public interface IVehicleRepository extends JpaRepository<Vehicle, Integer> {
    List<Vehicle> findAllByOwnerId(Integer ownerId);

    Optional<Vehicle> findByOwnerId(Integer ownerId);

    Optional<Vehicle> findByIdAndOwnerId(Integer id, Integer ownerId);

    Optional<Vehicle> findByPlate(String plate);

    boolean existsByPlate(String plate);
}
