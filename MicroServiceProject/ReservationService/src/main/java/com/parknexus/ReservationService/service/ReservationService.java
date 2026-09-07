package com.parknexus.ReservationService.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.parknexus.ReservationService.client.IParkingLotServiceClient;
import com.parknexus.ReservationService.client.IVehicleServiceClient;
import com.parknexus.ReservationService.dto.ParkingLotDto;
import com.parknexus.ReservationService.dto.ParkingSpotDto;
import com.parknexus.ReservationService.dto.VehicleDto;
import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ParkingSpotStatus;
import com.parknexus.ReservationService.form.CreateReservationForm;
import com.parknexus.ReservationService.repository.IReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final IReservationRepository reservationRepository;
    private final IParkingLotServiceClient parkingLotServiceClient;
    private final IVehicleServiceClient vehicleServiceClient;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(Integer reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
    }

    public Reservation createReservation(Integer userId, CreateReservationForm form) {
        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(form.getParkingLotId());
        ParkingSpotDto spot = parkingLotServiceClient.getParkingSpot(form.getParkingLotId(), form.getParkingSpotId());

        if (!spot.getStatus().equals(ParkingSpotStatus.Available)) {
            throw new IllegalArgumentException("Parking spot is not available");
        }

        VehicleDto vehicle = vehicleServiceClient.getVehicleById(form.getVehicleId());

        if (!vehicle.getType().equals(spot.getVehicleType())) {
            throw new IllegalArgumentException("Vehicle type does not match parking spot type");
        }
        BigDecimal pricePerHour = lot.getPrices().stream()
                .filter(p -> p.getVehicleType().equals(vehicle.getType()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Price for vehicle type not found"))
                .getPrice();

        Reservation newReservation = new Reservation();
        newReservation.setUserId(userId);
        newReservation.setCode(UUID.randomUUID().toString());
        newReservation.setParkingLotId(form.getParkingLotId());
        newReservation.setParkingSpotId(form.getParkingSpotId());
        newReservation.setVehicleId(form.getVehicleId());
        newReservation.setStartTime(form.getStartTime());
        newReservation.setEndTime(form.getEndTime());
        newReservation.setPricePerHour(pricePerHour);

        return reservationRepository.save(newReservation);
    }
}
