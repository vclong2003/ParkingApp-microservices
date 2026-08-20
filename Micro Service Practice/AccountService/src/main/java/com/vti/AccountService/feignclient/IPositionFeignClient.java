package com.vti.AccountService.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.vti.AccountService.dto.PositionDto;

@FeignClient(name = "PositionService", path = "/api/v1")
public interface IPositionFeignClient {
    @GetMapping("/positions/{id}")
    public ResponseEntity<PositionDto> getPositionByID(@PathVariable("id") int id);

}
