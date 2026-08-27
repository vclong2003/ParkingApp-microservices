package com.parknexus.VehicleService.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.Common.annotation.RequireRole;
import com.parknexus.Common.context.AccountContext;
import com.parknexus.Common.enums.AccountRole;
import com.parknexus.VehicleService.dto.VehicleDto;
import com.parknexus.VehicleService.entity.Vehicle;
import com.parknexus.VehicleService.form.CreateVehicleForm;
import com.parknexus.VehicleService.form.UpdateVehicleForm;
import com.parknexus.VehicleService.service.VehicleService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/v1/vehicles")
@CrossOrigin("*")
@AllArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @RequireRole({ AccountRole.User })
    @GetMapping()
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        AccountContext account = AccountContext.get();
        List<Vehicle> vehicles = vehicleService.getAllVehicles(account.getAccountId());
        List<VehicleDto> vehicleDtos = vehicles.stream().map(vehicle -> new VehicleDto(vehicle)).toList();

        return ResponseEntity.ok(vehicleDtos);
    }

    @RequireRole({ AccountRole.User })
    @PostMapping()
    public ResponseEntity<VehicleDto> createVehicle(@Valid @RequestBody CreateVehicleForm form) {
        AccountContext account = AccountContext.get();
        Vehicle newVehicle = vehicleService.createVehicle(account.getAccountId(), form);
        return ResponseEntity.ok(new VehicleDto(newVehicle));
    }

    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> updateVehicle(@PathVariable Integer vehicleId,
            @Valid @RequestBody UpdateVehicleForm form) {
        AccountContext account = AccountContext.get();
        Vehicle updatedVehicle = vehicleService.updateVehicle(vehicleId, account.getAccountId(), form);

        return ResponseEntity.ok(new VehicleDto(updatedVehicle));
    }
}
