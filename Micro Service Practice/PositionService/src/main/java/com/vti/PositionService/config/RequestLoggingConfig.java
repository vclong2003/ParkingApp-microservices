package com.vti.PositionService.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Configuration
public class RequestLoggingConfig {
    @Bean
    public CommonsRequestLoggingFilter logFilter() {
        CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
        filter.setIncludeQueryString(true); // Log query parameters
        filter.setIncludePayload(true); // Log request body
        filter.setMaxPayloadLength(10000); // Max payload length to log
        filter.setIncludeHeaders(false); // Include HTTP headers (set true if needed)
        filter.setIncludeClientInfo(true); // Log client IP & session ID
        return filter;
    }
}
