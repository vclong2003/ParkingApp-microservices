package com.parknexus.ReservationService.form;

import com.parknexus.ReservationService.enums.ReservationStatus;

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
