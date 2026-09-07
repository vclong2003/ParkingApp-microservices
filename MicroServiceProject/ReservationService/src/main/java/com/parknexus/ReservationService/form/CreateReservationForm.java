package com.parknexus.ReservationService.form;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateReservationForm {
    private Integer parkingLotId;
    private Integer parkingSpotId;
    private Integer vehicleId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
