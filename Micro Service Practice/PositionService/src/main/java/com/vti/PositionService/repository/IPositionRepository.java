package com.vti.PositionService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vti.PositionService.entity.Position;

public interface IPositionRepository extends JpaRepository<Position, Short> {
    public Position findByName(String name);

    public boolean existsByName(String name);

}
