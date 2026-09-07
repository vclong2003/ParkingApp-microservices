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
import com.parknexus.ReservationService.enums.ParkingLotStatus;
import com.parknexus.ReservationService.enums.ParkingSpotStatus;
import com.parknexus.ReservationService.enums.ReservationStatus;
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
        // check if start time is in the future, and in less than 48 hours
        if (form.getStartTime().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in the future");
        }
        if (form.getStartTime().isAfter(java.time.LocalDateTime.now().plusHours(48))) {
            throw new IllegalArgumentException("Start time must be within 48 hours");
        }

        // check if user has less than 3 pending reservations
        Long pendingReservationsCount = reservationRepository.countByUserIdAndStatus(userId, ReservationStatus.Pending);
        if (pendingReservationsCount >= 3) {
            throw new IllegalArgumentException("User has reached the maximum number of pending reservations");
        }

        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(form.getParkingLotId());
        // check if parking lot exists and active, check if owned by user
        if (lot == null || !lot.getStatus().equals(ParkingLotStatus.Active)) {
            throw new IllegalArgumentException("Parking lot is not active");
        }
        if (lot.getOwnerId().equals(userId)) {
            throw new IllegalArgumentException("User cannot reserve a spot in their own parking lot");
        }

        ParkingSpotDto spot = parkingLotServiceClient.getParkingSpot(form.getParkingLotId(), form.getParkingSpotId());

        if (!spot.getStatus().equals(ParkingSpotStatus.Available)) {
            throw new IllegalArgumentException("Parking spot is not available");
        }

        VehicleDto vehicle = vehicleServiceClient.getVehicleById(form.getVehicleId());
        // check if vehicle exists and owned by user
        if (vehicle == null || !vehicle.getOwnerId().equals(userId)) {
            throw new IllegalArgumentException("Vehicle does not belong to user");
        }

        if (!vehicle.getType().equals(spot.getVehicleType())) {
            throw new IllegalArgumentException("Vehicle type does not match parking spot type");
        }
        BigDecimal pricePerHour = lot.getPrices().stream()
                .filter(p -> p.getVehicleType().equals(vehicle.getType()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Price for vehicle type not found"))
                .getPrice();

        // check if start time is in the future, and in less than 48 hours
        if (form.getStartTime().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in the future");
        }
        if (form.getStartTime().isAfter(java.time.LocalDateTime.now().plusHours(48))) {
            throw new IllegalArgumentException("Start time must be within 48 hours");
        }

        // Reservation newReservation = new Reservation();
        // newReservation.setUserId(userId);
        // newReservation.setCode(UUID.randomUUID().toString());
        // newReservation.setParkingLotId(form.getParkingLotId());
        // newReservation.setParkingSpotId(form.getParkingSpotId());
        // newReservation.setVehicleId(form.getVehicleId());
        // newReservation.setStartTime(form.getStartTime());
        // newReservation.setEndTime(form.getEndTime());
        // newReservation.setPricePerHour(pricePerHour);

        // return reservationRepository.save(newReservation);
    }
}
