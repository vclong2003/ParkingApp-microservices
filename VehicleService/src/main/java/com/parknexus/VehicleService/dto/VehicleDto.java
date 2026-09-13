package com.parknexus.VehicleService.dto;

import com.parknexus.VehicleService.entity.Vehicle;
import com.parknexus.VehicleService.enums.VehicleType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {
    private Integer id;
    private VehicleType type;
    private Integer ownerId;
    private String brand;
    private String plate;
    private String model;
    private String color;
    private String imageUrl;

    public VehicleDto(Vehicle entity) {
        this.id = entity.getId();
        this.ownerId = entity.getOwnerId();
        this.type = entity.getType();
        this.brand = entity.getBrand();
        this.plate = entity.getPlate();
        this.model = entity.getModel();
        this.color = entity.getColor();
        this.imageUrl = entity.getImageUrl();
    }
}
