package com.parknexus.ParkingLotService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.parknexus.ParkingLotService.entity.ParkingLot;

public interface IParkingLotRepository
                extends JpaRepository<ParkingLot, Integer>, JpaSpecificationExecutor<ParkingLot> {
        public Optional<ParkingLot> findByOwnerIdAndId(Integer ownerId, Integer id);
}
