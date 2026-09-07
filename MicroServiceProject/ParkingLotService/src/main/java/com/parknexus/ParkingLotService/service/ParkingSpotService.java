package com.parknexus.ParkingLotService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parknexus.ParkingLotService.client.IUserServiceClient;
import com.parknexus.ParkingLotService.dto.UserDto;
import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.entity.ParkingSpot;
import com.parknexus.ParkingLotService.form.CreateParkingSpotForm;
import com.parknexus.ParkingLotService.repository.IParkingLotRepository;
import com.parknexus.ParkingLotService.repository.IParkingSpotRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParkingSpotService {
    private final IParkingLotRepository parkingLotRepository;
    private final IParkingSpotRepository parkingSpotRepository;

    public List<ParkingSpot> getParkingSpots(Integer parkingLotId) {
        List<ParkingSpot> spots = parkingSpotRepository.findAllByParkingLot_Id(parkingLotId);
        return spots;
    }

    @Transactional
    public ParkingSpot createParkingSpot(Integer userId, Integer parkingLotId, CreateParkingSpotForm form) {
        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(userId, parkingLotId)
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));

        ParkingSpot newSpot = new ParkingSpot();
        newSpot.setVehicleType(form.getVehicleType());
        newSpot.setParkingLot(lot);

        return parkingSpotRepository.save(newSpot);
    }

    @Transactional
    public void deleteParkingSpot(Integer userId, Integer parkingLotId, Integer spotId) {
        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(userId, parkingLotId)
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));
        ParkingSpot spot = parkingSpotRepository.findByIdAndParkingLot_Id(spotId, lot.getId())
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));

        parkingSpotRepository.delete(spot);
    }
}
