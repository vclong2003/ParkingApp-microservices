package com.vti.DepartmentService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vti.DepartmentService.entity.Department;
import com.vti.DepartmentService.form.CreateDepartmentForm;
import com.vti.DepartmentService.repository.IDepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final IDepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentByID(short id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public boolean existsById(short id) {
        return departmentRepository.existsById(id);
    }

    public Department createDepartment(CreateDepartmentForm form) {
        Department department = new Department();
        department.setName(form.getName());

        return departmentRepository.save(department);
    }

}
