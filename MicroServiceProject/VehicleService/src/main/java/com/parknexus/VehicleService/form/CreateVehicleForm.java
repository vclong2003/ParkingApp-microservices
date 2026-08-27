package com.parknexus.VehicleService.form;

import com.parknexus.VehicleService.enums.VehicleType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateVehicleForm {
    @NotNull
    private VehicleType type;

    @NotNull
    private String plate;

    @NotNull
    private String brand;

    @NotNull
    private String model;

    @NotNull
    private String color;

    private String imageUrl;

    private Integer ownerId;
}
