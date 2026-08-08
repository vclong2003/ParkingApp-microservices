package com.vti.PositionService.dto;

import lombok.Getter;

@Getter
public class PositionDto {
    private short id;

    private String name;

    public PositionDto(short id, String name) {
        this.id = id;
        this.name = name;
    }
}
