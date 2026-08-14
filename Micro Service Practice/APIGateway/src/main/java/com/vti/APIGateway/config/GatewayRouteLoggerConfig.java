package com.vti.APIGateway.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.cloud.gateway.server.mvc.config.GatewayMvcProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRouteLoggerConfig {
    private static final Logger log = LoggerFactory.getLogger(GatewayRouteLoggerConfig.class);

    @Bean
    public CommandLineRunner logGatewayRoutes(GatewayMvcProperties gatewayProperties) {
        return args -> {
            if (gatewayProperties.getRoutes() == null || gatewayProperties.getRoutes().isEmpty()) {
                log.warn("No routes found under 'spring.cloud.gateway.server.webmvc.routes'");
            } else {
                log.info("Routes --------------------------------------------------------");
                gatewayProperties.getRoutes().forEach(route -> {
                    log.info("Route ID   : {}", route.getId());
                    log.info("  -> Target URI : {}", route.getUri());
                    log.info("  -> Predicates : {}", route.getPredicates());
                    log.info("--------------------------------------------------------------");
                });
            }
        };
    }
}
