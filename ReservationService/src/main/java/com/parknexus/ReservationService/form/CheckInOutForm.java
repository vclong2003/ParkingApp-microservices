package com.parknexus.ReservationService.form;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckInOutForm {
    private Integer reservationId;
    private Integer ownerId;
    private String reservationCode;
}
