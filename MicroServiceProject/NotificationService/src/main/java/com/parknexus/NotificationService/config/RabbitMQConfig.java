package com.parknexus.NotificationService.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
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
    public TopicExchange exchange() {
        return new TopicExchange(rabbitMQProperties.exchange());
    }

    @Bean
    public Queue registrationQueue() {
        return new Queue(rabbitMQProperties.queue().registration(), true);
    }

    @Bean
    public Binding registrationBinding(Queue registrationQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(registrationQueue)
                .to(exchange)
                .with(rabbitMQProperties.routingKey().registration());
    }

    @Bean
    public Queue passwordResetQueue() {
        return new Queue(rabbitMQProperties.queue().passwordReset(), true);
    }

    @Bean
    public Binding passwordResetBinding(Queue passwordResetQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(passwordResetQueue)
                .to(exchange)
                .with(rabbitMQProperties.routingKey().passwordReset());
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
