package com.parknexus.ReservationService.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.parknexus.ReservationService.client.IParkingLotServiceClient;
import com.parknexus.ReservationService.client.IVehicleServiceClient;
import com.parknexus.ReservationService.dto.AvailableSpotsAndTypesDto;
import com.parknexus.ReservationService.dto.CreateReservationResultDto;
import com.parknexus.ReservationService.dto.ParkingLotDto;
import com.parknexus.ReservationService.dto.ParkingSpotDto;
import com.parknexus.ReservationService.dto.VehicleDto;
import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ParkingLotStatus;
import com.parknexus.ReservationService.enums.ReservationStatus;
import com.parknexus.ReservationService.enums.VehicleType;
import com.parknexus.ReservationService.form.CheckInOutForm;
import com.parknexus.ReservationService.form.CreateReservationForm;
import com.parknexus.ReservationService.form.GetAvailableSpotsAndTypesForm;
import com.parknexus.ReservationService.repository.IReservationRepository;
import com.parknexus.ReservationService.repository.specification.ReservationSpecifications;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final IReservationRepository reservationRepository;
    private final IParkingLotServiceClient parkingLotServiceClient;
    private final IVehicleServiceClient vehicleServiceClient;

    @Transactional
    public AvailableSpotsAndTypesDto getAvailableSpotsAndTypes(GetAvailableSpotsAndTypesForm form) {
        // add buffer for overstay
        LocalDateTime startTime = form.getStartTime().minusHours(2);
        LocalDateTime endTime = form.getEndTime().plusHours(2);

        /*
         * find overlapping reservations in the parking lot,
         * exclude"EXPIRED","CANCELLED", "COMPLETED"
         */
        Specification<Reservation> spec = ReservationSpecifications.filter(form.getParkingLotId(), startTime, endTime,
                List.of(ReservationStatus.Expired, ReservationStatus.Cancelled, ReservationStatus.Completed));
        List<Reservation> overlappingReservations = reservationRepository.findAll(spec);

        // get reserved parking spot ids
        List<Integer> reservedSpotIds = overlappingReservations.stream().map(spot -> spot.getParkingSpotId()).toList();

        // get all parking spots in the parking lot, filter out reserved spots
        List<ParkingSpotDto> parkingSpots = parkingLotServiceClient.getParkingSpots(form.getParkingLotId());
        List<ParkingSpotDto> availableSpots = parkingSpots.stream()
                .filter(spot -> !reservedSpotIds.contains(spot.getId()))
                .toList();

        // get available vehicle types from available spots
        List<VehicleType> availableVehicleTypes = availableSpots.stream().map(spot -> spot.getVehicleType()).distinct()
                .toList();

        // filter only types that have price
        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(form.getParkingLotId());
        List<VehicleType> vehicleTypesWithPrice = lot.getPrices().stream().map(p -> p.getVehicleType()).toList();
        List<VehicleType> filteredVehicleTypes = vehicleTypesWithPrice.stream()
                .filter(type -> availableVehicleTypes.contains(type)).toList();

        return new AvailableSpotsAndTypesDto(availableSpots, filteredVehicleTypes);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(Integer reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
    }

    @Transactional
    public CreateReservationResultDto createReservation(Integer userId, CreateReservationForm form) {
        // check if start time is in the future, and in less than 48 hours, and ahead
        // now at least 15 minutes. Min duration is 1 hour
        if (form.getStartTime().isBefore(java.time.LocalDateTime.now().plusMinutes(15))) {
            throw new IllegalArgumentException("Start time must be at least 15 minutes in the future");
        }
        if (form.getStartTime().isAfter(java.time.LocalDateTime.now().plusHours(48))) {
            throw new IllegalArgumentException("Start time must be within 48 hours");
        }
        if (form.getEndTime().isBefore(form.getStartTime().plusHours(1))) {
            throw new IllegalArgumentException("End time must be at least 1 hour after start time");
        }

        // check if user has less than 3 pending reservations
        Long pendingReservationsCount = reservationRepository.countByUserIdAndStatus(userId, ReservationStatus.Pending);
        if (pendingReservationsCount >= 3) {
            throw new IllegalArgumentException("User has reached the maximum number of pending reservations");
        }

        // check if parking lot exists and active, check if owned by user
        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(form.getParkingLotId());
        if (lot == null || !lot.getStatus().equals(ParkingLotStatus.Active)) {
            throw new IllegalArgumentException("Parking lot is not active");
        }
        if (lot.getOwnerId().equals(userId)) {
            throw new IllegalArgumentException("User cannot reserve a spot in their own parking lot");
        }

        // get available spots and vehicle types in the parking lot
        AvailableSpotsAndTypesDto availableSpotsAndTypes = getAvailableSpotsAndTypes(
                new GetAvailableSpotsAndTypesForm(form.getParkingLotId(), form.getStartTime(), form.getEndTime()));
        if (availableSpotsAndTypes.getAvailableSpots().size() == 0) {
            throw new IllegalArgumentException("No available spots in the parking lot");
        }
        if (availableSpotsAndTypes.getAvailableVehicleTypes().size() == 0) {
            throw new IllegalArgumentException("No available vehicle types in the parking lot");
        }

        // check if vehicle exists and owned by user, and if vehicle type is available
        VehicleDto vehicle = vehicleServiceClient.getVehicleById(form.getVehicleId());
        if (vehicle == null || !vehicle.getOwnerId().equals(userId)) {
            throw new IllegalArgumentException("Vehicle does not belong to user");
        }
        if (!availableSpotsAndTypes.getAvailableVehicleTypes().contains(vehicle.getType())) {
            throw new IllegalArgumentException("Vehicle type is not available in the parking lot");
        }

        // randomize a parking spot from the available spots that match the vehicle type
        ParkingSpotDto selectedSpot = availableSpotsAndTypes.getAvailableSpots()
                .get(new Random().nextInt(availableSpotsAndTypes.getAvailableSpots().size()));

        // get price per hour for the vehicle type in the parking lot
        BigDecimal pricePerHour = lot.getPrices().stream()
                .filter(p -> p.getVehicleType().equals(vehicle.getType()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Price for vehicle type not found"))
                .getPrice();

        Reservation newReservation = new Reservation();
        newReservation.setUserId(userId);
        newReservation.setCode(UUID.randomUUID().toString());
        newReservation.setParkingLotId(form.getParkingLotId());
        newReservation.setParkingSpotId(selectedSpot.getId());
        newReservation.setVehicleId(form.getVehicleId());
        newReservation.setStartTime(form.getStartTime());
        newReservation.setEndTime(form.getEndTime());
        newReservation.setPricePerHour(pricePerHour);

        Reservation savedReservation = reservationRepository.save(newReservation);
        return new CreateReservationResultDto(savedReservation, lot, vehicle, selectedSpot);
    }

    public void cancelReservation(Integer userId, Integer reservationId) {
        Reservation reservation = reservationRepository.findByIdAndUserId(reservationId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        if (!reservation.getStatus().equals(ReservationStatus.Pending)) {
            throw new IllegalArgumentException("Reservation is not pending");
        }
        reservation.setStatus(ReservationStatus.Cancelled);
        reservationRepository.save(reservation);
    }

    public void checkIn(CheckInOutForm form) {
        Reservation reservation = reservationRepository.findById(form.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        if (!reservation.getCode().equals(form.getReservationCode())) {
            throw new IllegalArgumentException("Reservation code does not match");
        }

        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(reservation.getParkingLotId());
        if (!lot.getOwnerId().equals(form.getOwnerId())) {
            throw new IllegalArgumentException("User is not the owner of the parking lot");
        }

        if (!reservation.getStatus().equals(ReservationStatus.Pending)) {
            throw new IllegalArgumentException("Reservation is not pending");
        }

        if (reservation.getStartTime().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reservation has not started yet");
        }

        reservation.setStatus(ReservationStatus.OnGoing);
        reservationRepository.save(reservation);

    }

    public void checkOut(CheckInOutForm form) {
        Reservation reservation = reservationRepository.findById(form.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        if (!reservation.getCode().equals(form.getReservationCode())) {
            throw new IllegalArgumentException("Reservation code does not match");
        }

        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(reservation.getParkingLotId());
        if (!lot.getOwnerId().equals(form.getOwnerId())) {
            throw new IllegalArgumentException("User is not the owner of the parking lot");
        }

        if (!reservation.getStatus().equals(ReservationStatus.OnGoing)) {
            throw new IllegalArgumentException("Reservation is not ongoing");
        }

        reservation.setStatus(ReservationStatus.Completed);
        reservationRepository.save(reservation);

    }
}
