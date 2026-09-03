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
    private final IUserServiceClient userServiceClient;

    public List<ParkingSpot> getParkingSpots(Integer parkingLotId) {
        List<ParkingSpot> spots = parkingSpotRepository.findAllByParkingLot_Id(parkingLotId);
        return spots;
    }

    @Transactional
    public ParkingSpot createParkingSpot(Integer accountId, Integer parkingLotId, CreateParkingSpotForm form) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);
        if (user == null) {
            throw new IllegalArgumentException();
        }

        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(user.getId(), parkingLotId)
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));

        ParkingSpot newSpot = new ParkingSpot();
        newSpot.setVehicleType(form.getVehicleType());
        newSpot.setParkingLot(lot);

        return parkingSpotRepository.save(newSpot);
    }

    @Transactional
    public void deleteParkingSpot(Integer accountId, Integer parkingLotId, Integer spotId) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);
        if (user == null) {
            throw new IllegalArgumentException();
        }

        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(user.getId(), parkingLotId)
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));
        ParkingSpot spot = parkingSpotRepository.findByIdAndParkingLot_Id(spotId, lot.getId())
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));

        parkingSpotRepository.delete(spot);
    }
}
