package com.parknexus.ParkingLotService.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.parknexus.Common.util.ObjectUtils;
import com.parknexus.ParkingLotService.IUserServiceClient;
import com.parknexus.ParkingLotService.dto.UserDto;
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
    private final IUserServiceClient userServiceClient;

    public List<ParkingLot> getAllParkingLot() {
        return parkingLotRepository.findAll();
    }

    @Transactional
    public List<ParkingLot> getParkingLots(Integer accountId, GetParkingLotsForm form) {
        Integer currentUserId = null;
        if (form.getIsMine() != null) {
            UserDto user = userServiceClient.getUserByAccountId(accountId);
            if (user != null) {
                currentUserId = user.getId();
            }
        }

        Specification<ParkingLot> spec = ParkingLotSpecifications.filterByForm(form, currentUserId);

        return parkingLotRepository.findAll(spec);
    }

    public ParkingLot createParkingLot(Integer accountId, CreateParkingLotForm form) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);
        if (user == null) {
            throw new IllegalArgumentException();
        }

        ParkingLot newParkingLot = new ParkingLot();
        newParkingLot.setOwnerId(user.getId());

        String[] formNullFields = ObjectUtils.getNullPropertyNames(form);
        BeanUtils.copyProperties(form, newParkingLot, formNullFields);

        return parkingLotRepository.save(newParkingLot);
    }

    @Transactional
    public ParkingLot upsertParkingLotPrice(Integer accountId, Integer parkingLotId, UpdatePriceForm form) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);
        if (user == null) {
            throw new IllegalArgumentException();
        }

        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(user.getId(), parkingLotId)
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
    public ParkingLot deleteParkingLotPrice(Integer accountId, Integer parkingLotId, VehicleType vehicleType) {
        UserDto user = userServiceClient.getUserByAccountId(accountId);
        if (user == null) {
            throw new IllegalArgumentException();
        }

        ParkingLot lot = parkingLotRepository.findByOwnerIdAndId(user.getId(), parkingLotId)
                .orElseThrow(() -> new NotFoundException("Parking lot not found"));

        Boolean removed = lot.getPrices().removeIf(price -> price.getVehicleType() == vehicleType);
        if (!removed) {
            throw new NotFoundException("Price not found");
        }

        return parkingLotRepository.save(lot);
    }
}
