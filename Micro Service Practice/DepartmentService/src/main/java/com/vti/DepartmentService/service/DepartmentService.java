package com.vti.DepartmentService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vti.DepartmentService.entity.Department;
import com.vti.DepartmentService.repository.IDepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService implements IDepartmentService {

    private final IDepartmentRepository departmentRepository;

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentByID(short id) {
        return departmentRepository.findById(id).orElse(null);
    }

}
