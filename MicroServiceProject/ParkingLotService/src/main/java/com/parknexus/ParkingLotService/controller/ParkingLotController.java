package com.parknexus.ParkingLotService.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.Common.annotation.RequireRole;
import com.parknexus.Common.context.AccountContext;
import com.parknexus.Common.enums.AccountRole;
import com.parknexus.ParkingLotService.dto.ParkingLotDto;
import com.parknexus.ParkingLotService.dto.ParkingSpotDto;
import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.entity.ParkingSpot;
import com.parknexus.ParkingLotService.enums.ParkingSpotStatus;
import com.parknexus.ParkingLotService.enums.VehicleType;
import com.parknexus.ParkingLotService.form.CreateParkingLotForm;
import com.parknexus.ParkingLotService.form.CreateParkingSpotForm;
import com.parknexus.ParkingLotService.form.GetParkingLotsForm;
import com.parknexus.ParkingLotService.form.UpdatePriceForm;
import com.parknexus.ParkingLotService.service.ParkingLotService;
import com.parknexus.ParkingLotService.service.ParkingSpotService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/v1/parkingLots")
@CrossOrigin("*")
@AllArgsConstructor
public class ParkingLotController {
    private final ParkingLotService parkingLotService;
    private final ParkingSpotService parkingSpotService;

    @RequireRole({ AccountRole.User, AccountRole.Admin })
    @GetMapping("")
    public ResponseEntity<List<ParkingLotDto>> getParkingLots(@ModelAttribute GetParkingLotsForm form) {
        AccountContext accountCtx = AccountContext.get();

        List<ParkingLot> lots = parkingLotService.getParkingLots(accountCtx.getUserId(), form);
        List<ParkingLotDto> dtos = lots.stream().map(lot -> {
            ParkingLotDto dto = new ParkingLotDto(lot);
            dto.setDescription(null);
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @RequireRole({ AccountRole.User, AccountRole.Admin })
    @GetMapping("/{lotId}")
    public ResponseEntity<ParkingLotDto> getParkingLot(@PathVariable Integer lotId) {
        ParkingLot lot = parkingLotService.getParkingLot(lotId);
        return ResponseEntity.ok(new ParkingLotDto(lot));
    }

    @RequireRole({ AccountRole.User })
    @PostMapping("")
    public ResponseEntity<ParkingLotDto> createParkingLot(@Valid @RequestBody CreateParkingLotForm form) {
        AccountContext accountCtx = AccountContext.get();

        ParkingLot lot = parkingLotService.createParkingLot(accountCtx.getUserId(), form);

        return ResponseEntity.ok(new ParkingLotDto(lot));
    }

    @RequireRole({ AccountRole.User })
    @PutMapping("/{lotId}/prices")
    public ResponseEntity<ParkingLotDto> upsertParkingLotPrice(@PathVariable Integer lotId,
            @Valid @RequestBody UpdatePriceForm form) {
        AccountContext accountCtx = AccountContext.get();

        ParkingLot lot = parkingLotService.upsertParkingLotPrice(accountCtx.getUserId(), lotId, form);

        return ResponseEntity.ok(new ParkingLotDto(lot));
    }

    @RequireRole({ AccountRole.User })
    @DeleteMapping("/{lotId}/prices")
    public ResponseEntity<ParkingLotDto> deletePrice(
            @PathVariable("lotId") Integer parkingLotId,
            @RequestParam VehicleType vehicleType) {
        AccountContext accountCtx = AccountContext.get();
        ParkingLot updatedLot = parkingLotService.deleteParkingLotPrice(accountCtx.getUserId(), parkingLotId,
                vehicleType);

        return ResponseEntity.ok(new ParkingLotDto(updatedLot));
    }

    @GetMapping("/{lotId}/spots")
    public ResponseEntity<List<ParkingSpotDto>> getParkingSpots(@PathVariable Integer lotId) {
        List<ParkingSpot> spots = parkingSpotService.getParkingSpots(lotId);
        List<ParkingSpotDto> dtos = spots.stream().map(spot -> new ParkingSpotDto(spot)).toList();

        return ResponseEntity.ok(dtos);
    }

    @RequireRole({})
    @GetMapping("/{lotId}/spots/{spotId}")
    public ResponseEntity<ParkingSpotDto> getParkingSpot(@PathVariable Integer lotId, @PathVariable Integer spotId) {
        ParkingSpot spot = parkingSpotService.getParkingSpot(lotId, spotId);
        return ResponseEntity.ok(new ParkingSpotDto(spot));
    }

    @PostMapping("/{lotId}/spots")
    public ResponseEntity<ParkingSpotDto> createParkingSpot(@PathVariable Integer lotId,
            @Valid @RequestBody CreateParkingSpotForm form) {
        AccountContext accountCtx = AccountContext.get();

        ParkingSpot newSpot = parkingSpotService.createParkingSpot(accountCtx.getUserId(), lotId, form);

        return ResponseEntity.ok(new ParkingSpotDto(newSpot));
    }

    @DeleteMapping("/{lotId}/spots/{spotId}")
    public ResponseEntity<Void> deleteParkingSpot(@PathVariable Integer lotId, @PathVariable Integer spotId) {
        AccountContext accountCtx = AccountContext.get();

        parkingSpotService.deleteParkingSpot(accountCtx.getUserId(), lotId, spotId);

        return ResponseEntity.ok().build();
    }

    @RequireRole({})
    @PutMapping("/{lotId}/spots/{spotId}/status")
    public ResponseEntity<ParkingSpotDto> updateParkingSpotStatus(@PathVariable Integer lotId,
            @PathVariable Integer spotId, @RequestParam ParkingSpotStatus status) {
        ParkingSpot updatedSpot = parkingSpotService.updateParkingSpotStatus(lotId, spotId, status);
        return ResponseEntity.ok(new ParkingSpotDto(updatedSpot));
    }
}
