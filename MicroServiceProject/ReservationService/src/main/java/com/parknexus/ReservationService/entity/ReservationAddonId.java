package com.parknexus.ReservationService.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationAddonId implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer addonId;
    private Integer reservation;
}
