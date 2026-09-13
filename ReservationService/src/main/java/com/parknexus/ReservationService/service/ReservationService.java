package com.parknexus.ReservationService.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.parknexus.ReservationService.client.IParkingLotServiceClient;
import com.parknexus.ReservationService.client.IVehicleServiceClient;
import com.parknexus.ReservationService.config.RabbitMQProperties;
import com.parknexus.ReservationService.dto.AvailableSpotsAndTypesDto;
import com.parknexus.ReservationService.dto.CreateReservationResultDto;
import com.parknexus.ReservationService.dto.ParkingLotDto;
import com.parknexus.ReservationService.dto.ParkingSpotDto;
import com.parknexus.ReservationService.dto.ReservationDto;
import com.parknexus.ReservationService.dto.VehicleDto;
import com.parknexus.ReservationService.dto.event.ReservationAutoCheckoutEvent;
import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ParkingLotStatus;
import com.parknexus.ReservationService.enums.ParkingSpotStatus;
import com.parknexus.ReservationService.enums.ReservationStatus;
import com.parknexus.ReservationService.enums.VehicleType;
import com.parknexus.ReservationService.form.CreateReservationForm;
import com.parknexus.ReservationService.form.GetAvailableSpotsAndTypesForm;
import com.parknexus.ReservationService.form.GetReservationsForm;
import com.parknexus.ReservationService.repository.IReservationRepository;
import com.parknexus.ReservationService.repository.specification.ReservationSpecifications;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {
    private final IReservationRepository reservationRepository;
    private final IParkingLotServiceClient parkingLotServiceClient;
    private final IVehicleServiceClient vehicleServiceClient;

    private final RabbitTemplate rabbitTemplate;
    private final RabbitMQProperties rabbitMQProperties;

    @Transactional
    public AvailableSpotsAndTypesDto getAvailableSpotsAndTypes(GetAvailableSpotsAndTypesForm form) {
        // add buffer for overstay
        LocalDateTime startTime = form.getStartTime().minusHours(2);
        LocalDateTime endTime = form.getEndTime().plusHours(2);
        log.info("Getting available spots and types for parking lot {} from {} to {}", form.getParkingLotId(),
                startTime, endTime);
        /*
         * find overlapping reservations in the parking lot,
         * exclude"EXPIRED","CANCELLED", "COMPLETED"
         */
        Specification<Reservation> spec = ReservationSpecifications.filter(form.getParkingLotId(), startTime, endTime,
                List.of(ReservationStatus.Expired, ReservationStatus.Cancelled, ReservationStatus.Completed), null,
                null, null, null);
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

    public List<ReservationDto> getReservations(GetReservationsForm form) {
        Specification<Reservation> spec = ReservationSpecifications.filter(form.getParkingLotId(), null, null,
                null,
                form.getUserId(),
                form.getVehicleId(), form.getSpotId(),
                form.getIncludedStatuses() != null ? List.of(form.getIncludedStatuses()) : null);

        return reservationRepository.findAll(spec).stream()
                .map(reservation -> {
                    ReservationDto reservationDto = new ReservationDto(reservation);
                    return reservationDto;
                })
                .toList();
    }

    public ReservationDto getReservation(Integer userId, Integer reservationId) {
        Reservation reservation = reservationRepository.findByIdAndUserId(reservationId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(reservation.getParkingLotId());
        VehicleDto vehicle = vehicleServiceClient.getVehicleById(reservation.getVehicleId());

        ReservationDto reservationDto = new ReservationDto(reservation);
        reservationDto.setParkingLotDto(lot);
        reservationDto.setVehicleDto(vehicle);

        return reservationDto;
    }

    public ReservationDto getReservationByCode(Integer ownerId, String code) {
        Reservation reservation = reservationRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(reservation.getParkingLotId());

        if (!lot.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("User is not the owner of the parking lot");
        }

        VehicleDto vehicle = vehicleServiceClient.getVehicleById(reservation.getVehicleId());

        ReservationDto reservationDto = new ReservationDto(reservation);
        reservationDto.setParkingLotDto(lot);
        reservationDto.setVehicleDto(vehicle);
        return reservationDto;
    }

    @Transactional
    public CreateReservationResultDto createReservation(Integer userId, CreateReservationForm form) {
        // check if start time is in the future, and in less than 48 hours, and ahead
        // now at least 15 minutes. Min duration is 1 hour
        if (form.getStartTime().isBefore(java.time.LocalDateTime.now().plusMinutes(10))) {
            throw new IllegalArgumentException("Start time must be at least 10 minutes in the future");
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

        // check if vehicle exists and owned by user, and if vehicle type is available,
        VehicleDto vehicle = vehicleServiceClient.getVehicleById(form.getVehicleId());
        if (vehicle == null || !vehicle.getOwnerId().equals(userId)) {
            throw new IllegalArgumentException("Vehicle does not belong to user");
        }
        if (!availableSpotsAndTypes.getAvailableVehicleTypes().contains(vehicle.getType())) {
            throw new IllegalArgumentException("Vehicle type is not available in the parking lot");
        }

        // check for overlapping reservations with the vehicle
        List<Reservation> overlappingReservations = reservationRepository.findAll(
                ReservationSpecifications.filter(null, form.getStartTime(), form.getEndTime(),
                        List.of(ReservationStatus.Expired, ReservationStatus.Cancelled, ReservationStatus.Completed),
                        userId,
                        form.getVehicleId(), null, null));
        if (!overlappingReservations.isEmpty()) {
            throw new IllegalArgumentException("Vehicle has overlapping reservations");
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

    public void checkIn(String code, Integer ownerId) {
        Reservation reservation = reservationRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(reservation.getParkingLotId());
        if (!lot.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("User is not the owner of the parking lot");
        }

        if (!reservation.getStatus().equals(ReservationStatus.Pending)) {
            throw new IllegalArgumentException("Reservation is not pending");
        }

        // comment for testing
        // if (reservation.getStartTime().isAfter(LocalDateTime.now())) {
        // throw new IllegalArgumentException("Reservation has not started yet");
        // }

        reservation.setStatus(ReservationStatus.OnGoing);
        // create auto checkout by delayed mq event
        // long delayMillis = java.time.Duration.ofMinutes(3).toMillis(); // test
        long delayMillis = java.time.Duration.between(java.time.LocalDateTime.now(),
                reservation.getEndTime())
                .toMillis();
        if (delayMillis < 0) {
            delayMillis = 0;
        }
        final long delay = delayMillis;
        ReservationAutoCheckoutEvent event = new ReservationAutoCheckoutEvent(reservation.getId());
        try {
            rabbitTemplate.convertAndSend(
                    rabbitMQProperties.exchange().reservation(),
                    rabbitMQProperties.routingKey().reservation().autoCheckOut(),
                    event, message -> {
                        message.getMessageProperties().setHeader("x-delay", delay);
                        return message;
                    });
            log.info("added to queue -----------");
        } catch (Exception e) {
            log.error("error adding to queue ----------");
        }

        parkingLotServiceClient.updateParkingSpotStatus(reservation.getParkingLotId(),
                reservation.getParkingSpotId(), ParkingSpotStatus.Occupied);

        reservationRepository.save(reservation);

    }

    public void checkOut(String code, Integer ownerId) {
        Reservation reservation = reservationRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        ParkingLotDto lot = parkingLotServiceClient.getParkingLot(reservation.getParkingLotId());
        if (!lot.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("User is not the owner of the parking lot");
        }

        if (!reservation.getStatus().equals(ReservationStatus.OnGoing)
                && !reservation.getStatus().equals(ReservationStatus.Overstayed)) {
            throw new IllegalArgumentException("Reservation is not ongoing");
        }

        reservation.setStatus(ReservationStatus.Completed);

        parkingLotServiceClient.updateParkingSpotStatus(reservation.getParkingLotId(),
                reservation.getParkingSpotId(), ParkingSpotStatus.Available);

        reservationRepository.save(reservation);

    }
}
