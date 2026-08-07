package com.vti.DepartmentService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vti.DepartmentService.entity.Department;

public interface IDepartmentRepository extends JpaRepository<Department, Short> {
    public Department findByName(String name);

    public boolean existsByName(String name);
}
