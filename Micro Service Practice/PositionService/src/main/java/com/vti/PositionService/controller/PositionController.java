package com.vti.PositionService.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vti.PositionService.dto.PositionDto;
import com.vti.PositionService.entity.Position;
import com.vti.PositionService.service.PositionService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/v1/positions")
@CrossOrigin("*")
@AllArgsConstructor
public class PositionController {
    private final PositionService positionService;

    @GetMapping()
    public ResponseEntity<List<PositionDto>> getMethodName() {
        List<Position> entities = positionService.getAllPositions();
        List<PositionDto> dtos = new ArrayList<>();

        for (Position entity : entities) {
            PositionDto dto = new PositionDto(entity.getId(), entity.getName().toString());
            dtos.add(dto);
        }

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PositionDto> getMethodName(@PathVariable(name = "id") short id) {
        Position position = positionService.getPositionByID(id);
        PositionDto positionDto = new PositionDto(position.getId(), position.getName().toString());

        return new ResponseEntity<>(positionDto, HttpStatus.OK);
    }

}
