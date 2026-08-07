package com.vti.DepartmentService.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vti.DepartmentService.dto.DepartmentDto;
import com.vti.DepartmentService.entity.Department;
import com.vti.DepartmentService.service.DepartmentService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping(value = "api/v1/departments")
@CrossOrigin("*")
@AllArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping()
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        List<Department> entities = departmentService.getAllDepartments();
        List<DepartmentDto> dtos = new ArrayList<>();

        for (Department entity : entities) {
            DepartmentDto dto = new DepartmentDto(entity.getId(), entity.getName());
            dtos.add(dto);
        }

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable(name = "id") short id) {
        Department department = departmentService.getDepartmentByID(id);
        DepartmentDto departmentDto = new DepartmentDto(department.getId(), department.getName());

        return new ResponseEntity<>(departmentDto, HttpStatus.OK);
    }

}
