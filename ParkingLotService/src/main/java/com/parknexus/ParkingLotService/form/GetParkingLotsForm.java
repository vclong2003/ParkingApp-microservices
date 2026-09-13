package com.parknexus.ParkingLotService.form;

import com.parknexus.ParkingLotService.enums.ParkingLotStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetParkingLotsForm {
    private String name;
    private Double latitude;
    private Double longitude;
    private Double radiusInKm;
    private ParkingLotStatus status;
    private Boolean isApproved;
    private Boolean isMine;
}
