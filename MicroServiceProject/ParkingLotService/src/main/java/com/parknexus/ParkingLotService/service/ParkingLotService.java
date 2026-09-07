package com.parknexus.ParkingLotService.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.parknexus.Common.util.ObjectUtils;
import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.entity.ParkingLotPrice;
import com.parknexus.ParkingLotService.enums.VehicleType;
import com.parknexus.ParkingLotService.form.CreateParkingLotForm;
import com.parknexus.ParkingLotService.form.GetParkingLotsForm;
import com.parknexus.ParkingLotService.form.UpdatePriceForm;
import com.parknexus.ParkingLotService.repository.IParkingLotRepository;
import com.parknexus.ParkingLotService.repository.specification.ParkingLotSpecifications;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParkingLotService {
    private final IParkingLotRepository parkingLotRepository;

    public ParkingLot getParkingLot(Integer parkingLotId) {
        ParkingLot lot = parkingLotRepository.findById(parkingLotId)
                .orElseThrow(() -> new NotFoundException("Parking lot now found"));
        return lot;
    }

    @Transactional
    public List<ParkingLot> getParkingLots(Integer userId, GetParkingLotsForm form) {
        Specification<ParkingLot> spec = ParkingLotSpecifications.filterByForm(form, userId);

        return parkingLotRepository.findAll(spec);
    }

    public ParkingLot createParkingLot(Integer userId, CreateParkingLotForm form) {
        ParkingLot newParkingLot = new ParkingLot();
        newParkingLot.setOwnerId(userId);

        String[] formNullFields = ObjectUtils.getNullPropertyNames(form);
        BeanUtils.copyProperties(form, newParkingLot, formNullFields);

        return parkingLotRepository.save(newParkingLot);
    }

    @Transactional
    public ParkingLot upsertParkingLotPrice(Integer userId, Integer parkingLotId, UpdatePriceForm form) {
        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(userId, parkingLotId)
                .orElseThrow(() -> new NotFoundException("Parking lot now found"));

        Optional<ParkingLotPrice> optionalExistingPrice = lot.getPrices().stream()
                .filter(p -> p.getVehicleType() == form.getVehicleType())
                .findFirst();

        if (optionalExistingPrice.isPresent()) {
            optionalExistingPrice.get().setPrice(form.getPrice());
        }

        if (optionalExistingPrice.isEmpty()) {
            ParkingLotPrice newPrice = new ParkingLotPrice();
            newPrice.setVehicleType(form.getVehicleType());
            newPrice.setPrice(form.getPrice());
            newPrice.setParkingLot(lot);
            lot.getPrices().add(newPrice);
        }

        return parkingLotRepository.save(lot);
    }

    @Transactional
    public ParkingLot deleteParkingLotPrice(Integer userId, Integer parkingLotId, VehicleType vehicleType) {
        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(userId, parkingLotId)
                .orElseThrow(() -> new NotFoundException("Parking lot not found"));

        Boolean removed = lot.getPrices().removeIf(price -> price.getVehicleType() == vehicleType);
        if (!removed) {
            throw new NotFoundException("Price not found");
        }

        return parkingLotRepository.save(lot);
    }
}
