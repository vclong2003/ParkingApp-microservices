package com.parknexus.ParkingLotService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.ParkingLotService.entity.ParkingLot;

public interface IParkingLotRepository extends JpaRepository<ParkingLot, Integer> {

}
