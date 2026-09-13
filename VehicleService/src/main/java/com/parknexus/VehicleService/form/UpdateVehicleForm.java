package com.parknexus.VehicleService.form;

import com.parknexus.VehicleService.enums.VehicleType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateVehicleForm {
    private VehicleType type;
    private String plate;
    private String brand;
    private String model;
    private String color;
    private String imageUrl;
}
