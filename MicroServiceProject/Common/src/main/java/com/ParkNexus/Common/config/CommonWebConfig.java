package com.ParkNexus.Common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.ParkNexus.Common.interceptor.UserContextInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@ComponentScan(basePackages = "com.ParkNexus.Common")
@ConditionalOnWebApplication
@RequiredArgsConstructor
public class CommonWebConfig implements WebMvcConfigurer {
    private final UserContextInterceptor userContextInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userContextInterceptor);
    }
}
