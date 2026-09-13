package com.parknexus.NotificationService.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "onesignal")
public record OneSignalProperties(
                String restApiKey, String orgApiKey, String appId, Templates templates) {
        public record Templates(
                        String registerOtp, String forgotPasswordOtp) {
        }
}
