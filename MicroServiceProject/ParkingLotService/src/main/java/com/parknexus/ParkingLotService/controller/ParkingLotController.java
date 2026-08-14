package com.parknexus.ParkingLotService.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.ParkingLotService.dto.ParkingLotDto;
import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.service.ParkingLotService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("api/v1/parkingLots")
@CrossOrigin("*")
@AllArgsConstructor
public class ParkingLotController {
    private final ParkingLotService parkingLotService;

    @GetMapping()
    public ResponseEntity<List<ParkingLotDto>> getAllParkingLots() {
        List<ParkingLot> parkingLots = parkingLotService.getAllParkingLot();
        List<ParkingLotDto> parkingLotDtos = parkingLots.stream().map(parkingLot -> new ParkingLotDto(parkingLot))
                .toList();

        return new ResponseEntity<>(parkingLotDtos, HttpStatus.OK);
    }

}
