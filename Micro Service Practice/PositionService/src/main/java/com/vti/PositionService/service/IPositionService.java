package com.vti.PositionService.service;

import java.util.List;

import com.vti.PositionService.entity.Position;

public interface IPositionService {
    public List<Position> getAllPositions();

    public Position getPositionByID(short id);
}
