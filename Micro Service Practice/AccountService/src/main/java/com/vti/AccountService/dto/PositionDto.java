package com.vti.AccountService.dto;

import com.vti.AccountService.entity.Position.PositionName;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PositionDto {
    private short id;
    private PositionName name;
}
