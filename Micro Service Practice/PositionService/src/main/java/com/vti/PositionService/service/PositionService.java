package com.vti.PositionService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vti.PositionService.entity.Position;
import com.vti.PositionService.repository.IPositionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PositionService implements IPositionService {
    private final IPositionRepository positionRepository;

    @Override
    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    @Override
    public Position getPositionByID(short id) {
        return positionRepository.findById(id).orElse(null);
    }
}
