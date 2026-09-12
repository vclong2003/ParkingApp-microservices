package com.parknexus.ParkingLotService.form;

import java.time.LocalTime;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateParkingLotForm {
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private List<String> newMediaUrls;
    private List<String> removedMediaUrls;
    private LocalTime openAt;
    private LocalTime closeAt;
}
