package com.parknexus.VehicleService.client;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.parknexus.Common.config.FeignConfig;

@FeignClient(name = "StorageService", path = "/api/v1/storage", configuration = FeignConfig.class)
public interface IStorageServiceClient {
    @GetMapping("/signed-url")
    public Map<String, String> getSignedUrl(@RequestParam("bucketUrl") String bucketUrl);
}
