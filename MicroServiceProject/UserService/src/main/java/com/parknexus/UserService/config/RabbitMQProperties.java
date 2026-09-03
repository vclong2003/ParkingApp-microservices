package com.parknexus.UserService.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rabbitmq")
public record RabbitMQProperties(
        String exchange,
        Queue queue,
        RoutingKey routingKey) {
    public record Queue(String registration) {
    }

    public record RoutingKey(String registration) {
    }
}
