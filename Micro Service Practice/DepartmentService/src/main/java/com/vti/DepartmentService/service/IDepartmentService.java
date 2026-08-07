package com.vti.DepartmentService.service;

import java.util.List;

import com.vti.DepartmentService.entity.Department;

public interface IDepartmentService {
    public List<Department> getAllDepartments();

    public Department getDepartmentByID(short id);
}
