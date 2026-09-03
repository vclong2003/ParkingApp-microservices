package com.parknexus.ParkingLotService.form;

import com.parknexus.ParkingLotService.enums.VehicleType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateParkingSpotForm {
    @NotNull
    private VehicleType vehicleType;
}
