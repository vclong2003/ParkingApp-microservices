package com.parknexus.VehicleService.dto;

import com.parknexus.VehicleService.entity.Vehicle;
import com.parknexus.VehicleService.entity.Vehicle.VehicleType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {
    private Integer id;

    private VehicleType type;

    private String brand;

    private String model;

    private String color;

    private String imageUrl;

    public VehicleDto(Vehicle entity) {
        this.id = entity.getId();
        this.type = entity.getType();
        this.brand = entity.getBrand();
        this.model = entity.getModel();
        this.color = entity.getColor();
        this.imageUrl = entity.getImageUrl();
    }
}
