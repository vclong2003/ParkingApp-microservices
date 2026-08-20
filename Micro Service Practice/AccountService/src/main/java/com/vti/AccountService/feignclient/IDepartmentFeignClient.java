package com.vti.AccountService.feignclient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.vti.AccountService.dto.DepartmentDto;
import com.vti.AccountService.form.CreateDepartmentForm;

@FeignClient(name = "DepartmentService", path = "/api/v1")
public interface IDepartmentFeignClient {
    @GetMapping("/departments/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentByID(@PathVariable("id") int id);

    @GetMapping("/departments")
    ResponseEntity<List<DepartmentDto>> getAllDepartments();

    @GetMapping("/departments/{id}/exists")
    ResponseEntity<Boolean> existsDepartment(@PathVariable("id") int id);

    @PostMapping("/departments")
    ResponseEntity<DepartmentDto> createDepartment(@RequestBody CreateDepartmentForm form);

}
