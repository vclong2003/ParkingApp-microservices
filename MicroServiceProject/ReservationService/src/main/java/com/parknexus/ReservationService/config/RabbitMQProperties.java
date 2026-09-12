package com.parknexus.ReservationService.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rabbitmq")
public record RabbitMQProperties(
        Exchange exchange,
        Queue queue,
        RoutingKey routingKey) {
    public record Exchange(String notification, String reservation) {
    }

    public record Queue(Reservation reservation) {
        public record Reservation(String autoCheckOut) {
        }
    }

    public record RoutingKey(Notification notification, Reservation reservation) {
        public record Notification(String autoCheckOut) {
        }

        public record Reservation(String autoCheckOut) {
        }
    }
}
