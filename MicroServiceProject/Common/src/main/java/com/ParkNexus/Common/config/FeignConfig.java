package com.parknexus.Common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;

@Configuration
@ConditionalOnClass(RequestInterceptor.class)
public class FeignConfig {
    @Bean
    public RequestInterceptor feignRequestInterceptor() {
        // to identify a internal request
        return requestTemplate -> requestTemplate.header("X-Internal-Request", "true");
    }
}
