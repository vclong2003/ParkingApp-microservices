package com.parknexus.ParkingLotService.entity;

import java.io.Serializable;

import com.parknexus.ParkingLotService.enums.VehicleType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLotPriceId implements Serializable {
    private static final long serialVersionUID = 1L;

    private VehicleType vehicleType;
    private Integer parkingLot;

}
