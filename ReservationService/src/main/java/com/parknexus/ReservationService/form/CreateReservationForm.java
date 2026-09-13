package com.parknexus.ReservationService.form;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateReservationForm {
    @NotNull
    private Integer parkingLotId;

    @NotNull
    private Integer vehicleId;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;
}
