package com.parknexus.ReservationService.dto;

import com.parknexus.ReservationService.enums.VehicleType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
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
}
