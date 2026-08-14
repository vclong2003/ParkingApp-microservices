package com.parknexus.ParkingLotService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.repository.IParkingLotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParkingLotService {
    private final IParkingLotRepository parkingLotRepository;

    public List<ParkingLot> getAllParkingLot() {
        return parkingLotRepository.findAll();
    }
}
