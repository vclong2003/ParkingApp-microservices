package com.parknexus.UserService.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "onesignal")
public record OneSignalProperties(
        String restApiKey, String orgApiKey, String appId) {

}
