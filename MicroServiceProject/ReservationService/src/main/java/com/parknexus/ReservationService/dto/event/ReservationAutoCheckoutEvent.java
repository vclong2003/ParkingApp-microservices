package com.parknexus.ReservationService.dto.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationAutoCheckoutEvent {
    private Integer reservationId;

}
