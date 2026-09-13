package com.parknexus.NotificationService.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.onesignal.client.ApiClient;
import com.onesignal.client.api.DefaultApi;
import com.onesignal.client.auth.HttpBearerAuth;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class OneSignalConfig {
    private final OneSignalProperties oneSignalProperties;

    @Bean
    public DefaultApi defaultApi() {
        ApiClient defaultClient = com.onesignal.client.Configuration.getDefaultApiClient();

        HttpBearerAuth restApiAuth = (HttpBearerAuth) defaultClient
                .getAuthentication("rest_api_key");
        restApiAuth.setBearerToken(oneSignalProperties.restApiKey());

        HttpBearerAuth orgApiAuth = (HttpBearerAuth) defaultClient
                .getAuthentication("organization_api_key");
        orgApiAuth.setBearerToken(oneSignalProperties.orgApiKey());

        DefaultApi client = new DefaultApi(defaultClient);
        return client;
    }
}
