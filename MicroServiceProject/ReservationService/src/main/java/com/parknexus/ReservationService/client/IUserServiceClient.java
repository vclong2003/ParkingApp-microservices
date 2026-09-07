package com.parknexus.ReservationService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.parknexus.Common.config.FeignConfig;
import com.parknexus.ReservationService.dto.UserDto;

@FeignClient(name = "UserService", path = "/api/v1/users", configuration = FeignConfig.class)
public interface IUserServiceClient {
    @GetMapping("/id/{userId}")
    UserDto getUserById(@PathVariable Integer userId);
}
