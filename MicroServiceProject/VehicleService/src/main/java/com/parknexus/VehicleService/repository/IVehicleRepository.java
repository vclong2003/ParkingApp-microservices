package com.parknexus.VehicleService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.VehicleService.entity.Vehicle;

public interface IVehicleRepository extends JpaRepository<Vehicle, Integer> {

}
