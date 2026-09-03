package com.parknexus.ParkingLotService.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.ParkingLotService.entity.ParkingSpot;

public interface IParkingSpotRepository extends JpaRepository<ParkingSpot, Integer> {
    public List<ParkingSpot> findAllByParkingLot_Id(Integer parkingLotId);

    Optional<ParkingSpot> findByIdAndParkingLot_Id(Integer id, Integer parkingLotId);
}
