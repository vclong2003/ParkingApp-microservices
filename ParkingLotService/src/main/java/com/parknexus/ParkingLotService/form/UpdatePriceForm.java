package com.parknexus.ParkingLotService.form;

import java.math.BigDecimal;

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
public class UpdatePriceForm {
    @NotNull
    private VehicleType vehicleType;

    @NotNull
    private BigDecimal price;
}
