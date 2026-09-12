package com.parknexus.ReservationService.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.CustomExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class RabbitMQConfig {
    private final RabbitMQProperties rabbitMQProperties;

    @Bean
    public CustomExchange reservationDelayedExchange() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-delayed-type", "direct");
        return new CustomExchange(
                rabbitMQProperties.exchange().reservation(),
                "x-delayed-message",
                true,
                false,
                args);
    }

    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(rabbitMQProperties.exchange().notification());
    }

    @Bean
    public Queue autoCheckOutReservationQueue() {
        return new Queue(rabbitMQProperties.queue().reservation().autoCheckOut(), true);
    }

    @Bean
    public Binding autoCheckOutReservationBinding(Queue autoCheckOutReservationQueue,
            CustomExchange reservationDelayedExchange) {
        return BindingBuilder
                .bind(autoCheckOutReservationQueue)
                .to(reservationDelayedExchange)
                .with(rabbitMQProperties.routingKey().reservation().autoCheckOut()).noargs();
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
