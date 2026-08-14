package com.parknexus.ParkingLotService.entity;

import java.io.Serializable;

import com.parknexus.ParkingLotService.enums.VehicleType;

public class ParkingLotPriceId implements Serializable {
    private static final long serialVersionUID = 1L;

    private VehicleType vehicleType;
    private Integer parkingLot;

}
