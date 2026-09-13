package com.parknexus.ParkingLotService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parknexus.ParkingLotService.client.IReservationServiceClient;
import com.parknexus.ParkingLotService.dto.ReservationDto;
import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.entity.ParkingSpot;
import com.parknexus.ParkingLotService.enums.ParkingSpotStatus;
import com.parknexus.ParkingLotService.enums.ReservationStatus;
import com.parknexus.ParkingLotService.form.CreateParkingSpotForm;
import com.parknexus.ParkingLotService.form.GetReservationsForm;
import com.parknexus.ParkingLotService.repository.IParkingLotRepository;
import com.parknexus.ParkingLotService.repository.IParkingSpotRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParkingSpotService {
    private final IParkingLotRepository parkingLotRepository;
    private final IParkingSpotRepository parkingSpotRepository;
    private final IReservationServiceClient reservationServiceClient;

    public ParkingSpot getParkingSpot(Integer parkingLotId, Integer parkingSpotId) {
        ParkingSpot spot = parkingSpotRepository.findByIdAndParkingLot_Id(parkingSpotId, parkingLotId)
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));
        return spot;
    }

    public List<ParkingSpot> getParkingSpots(Integer parkingLotId) {
        List<ParkingSpot> spots = parkingSpotRepository.findAllByParkingLot_Id(parkingLotId);
        return spots;
    }

    public ParkingSpot updateParkingSpotStatus(Integer parkingLotId, Integer parkingSpotId, ParkingSpotStatus status) {
        ParkingSpot spot = parkingSpotRepository.findByIdAndParkingLot_Id(parkingSpotId, parkingLotId)
                .orElseThrow(() -> new IllegalArgumentException("Parking lot now found"));
        spot.setStatus(status);

        return parkingSpotRepository.save(spot);
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

        List<ReservationDto> relatedReservations = reservationServiceClient.getReservations(
                new GetReservationsForm(null, parkingLotId, null, spotId, new ReservationStatus[] {
                        ReservationStatus.Pending,
                        ReservationStatus.OnGoing,
                        ReservationStatus.Overstayed
                }));

        if (!relatedReservations.isEmpty()) {
            throw new IllegalArgumentException("Cannot delete parking spot with active reservations");
        }

        parkingSpotRepository.delete(spot);
    }
}
