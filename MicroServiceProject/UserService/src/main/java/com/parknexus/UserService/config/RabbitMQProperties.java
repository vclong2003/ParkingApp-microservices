package com.parknexus.UserService.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rabbitmq")
public record RabbitMQProperties(
        Exchange exchange,
        RoutingKey routingKey) {
    public record Exchange(String notification) {
    }

    public record RoutingKey(Notification notification) {
        public record Notification(String registration, String passwordReset) {
        }
    }
}
