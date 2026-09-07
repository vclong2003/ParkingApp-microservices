package com.parknexus.UserService.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security")
public record SecurityProperties(Integer accessTokenExpirationMinutes, Jwt jwt, Admin admin) {
    public record Jwt(String privateKey) {

    }

    public record Admin(String email, String password) {

    }
}
