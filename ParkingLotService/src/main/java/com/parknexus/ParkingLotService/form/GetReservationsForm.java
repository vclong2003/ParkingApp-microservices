package com.parknexus.ParkingLotService.form;

import com.parknexus.ParkingLotService.enums.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetReservationsForm {
    private Integer userId;

    private Integer parkingLotId;

    private Integer vehicleId;

    private Integer spotId;

    private ReservationStatus[] includedStatuses;
}
