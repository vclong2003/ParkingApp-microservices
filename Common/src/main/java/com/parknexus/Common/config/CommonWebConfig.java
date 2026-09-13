package com.parknexus.Common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.parknexus.Common.interceptor.RoleAuthInterceptor;
import com.parknexus.Common.interceptor.UserContextInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@ComponentScan(basePackages = "com.parknexus.Common")
@ConditionalOnWebApplication
@RequiredArgsConstructor
public class CommonWebConfig implements WebMvcConfigurer {
    private final UserContextInterceptor userContextInterceptor;
    private final RoleAuthInterceptor roleAuthInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userContextInterceptor); // add user to context
        registry.addInterceptor(roleAuthInterceptor); // filter based on role
    }
}
