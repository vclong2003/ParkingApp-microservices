package com.parknexus.StorageService.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.parknexus.StorageService.service.StorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/storage")
@CrossOrigin("*")
@RequiredArgsConstructor
public class StorageController {
    private final StorageService storageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String bucketUrl = storageService.uploadFile(file);
        return ResponseEntity.ok(Map.of("bucketUrl", bucketUrl));
    }

    @GetMapping("/signed-url")
    public ResponseEntity<Map<String, String>> getSignedUrl(@RequestParam("bucketUrl") String bucketUrl) {
        String signedUrl = storageService.generateSignedUrl(bucketUrl);
        return ResponseEntity.ok(Map.of("signedUrl", signedUrl));
    }

    @GetMapping("/bucket-url")
    public ResponseEntity<Map<String, String>> getBucketUrl(@RequestParam("signedUrl") String signedUrl) {
        String bucketUrl = storageService.getBucketPathFromSignedUrl(signedUrl);
        return ResponseEntity.ok(Map.of("bucketUrl", bucketUrl));
    }
}
