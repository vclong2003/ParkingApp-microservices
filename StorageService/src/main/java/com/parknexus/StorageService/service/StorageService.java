package com.parknexus.StorageService.service;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.HttpMethod;
import com.google.cloud.storage.Storage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StorageService {
    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String defaultBucketName;

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        BlobId blobId = BlobId.of(defaultBucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        storage.create(blobInfo, file.getBytes());

        return String.format("gs://%s/%s", defaultBucketName, fileName);
    }

    public String generateSignedUrl(String bucketUrl) {
        String bucket = this.defaultBucketName;
        String objectName = bucketUrl;

        if (bucketUrl.startsWith("gs://")) {
            String path = bucketUrl.substring(5); // remove gs://
            int slashIndex = path.indexOf('/');
            bucket = path.substring(0, slashIndex);
            objectName = path.substring(slashIndex + 1);
        } else if (bucketUrl.startsWith("https://storage.googleapis.com/")) {
            String path = bucketUrl.replace("https://storage.googleapis.com/", "");
            int slashIndex = path.indexOf('/');
            bucket = path.substring(0, slashIndex);
            objectName = path.substring(slashIndex + 1);
        }

        BlobId blobId = BlobId.of(bucket, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        URL signedUrl = storage.signUrl(
                blobInfo,
                1,
                TimeUnit.DAYS,
                Storage.SignUrlOption.httpMethod(HttpMethod.GET),
                Storage.SignUrlOption.withV4Signature());

        return signedUrl.toString();
    }

    public String getBucketPathFromSignedUrl(String signedUrl) {
        if (signedUrl == null || signedUrl.isBlank()) {
            throw new IllegalArgumentException("Signed URL cannot be empty");
        }

        try {
            URI uri = URI.create(signedUrl);
            String host = uri.getHost();
            String path = uri.getPath(); // Automatically strips '?X-Goog-...' query parameters

            if (path == null || path.length() <= 1) {
                throw new IllegalArgumentException("Invalid signed URL: missing object path");
            }

            // remove leading slash
            path = path.startsWith("/") ? path.substring(1) : path;

            String bucket;
            String objectName;

            if ("storage.googleapis.com".equalsIgnoreCase(host)) {
                // Path style: https://storage.googleapis.com/{bucket}/{object}
                int slashIndex = path.indexOf('/');
                if (slashIndex == -1) {
                    throw new IllegalArgumentException("Invalid signed URL: missing object name in path");
                }
                bucket = path.substring(0, slashIndex);
                objectName = path.substring(slashIndex + 1);
            } else if (host != null && host.endsWith(".storage.googleapis.com")) {
                // Virtual-hosted style: https://{bucket}.storage.googleapis.com/{object}
                bucket = host.substring(0, host.indexOf(".storage.googleapis.com"));
                objectName = path;
            } else {
                throw new IllegalArgumentException("URL host is not a recognized Google Cloud Storage domain");
            }

            return String.format("gs://%s/%s", bucket, objectName);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse signed URL: " + e.getMessage(), e);
        }
    }

}
