package com.vti.DepartmentService.dto;

import lombok.Getter;

@Getter
public class DepartmentDto {
    private short id;

    private String name;

    public DepartmentDto(short id, String name) {
        this.id = id;
        this.name = name;
    }
}
