package com.parknexus.ParkingLotService.form;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateParkingLotForm {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @NotNull
    private List<String> mediaUrls = new ArrayList<>();

    private LocalTime openAt;

    private LocalTime closeAt;
}
