package com.parknexus.NotificationService.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.onesignal.client.model.CreateNotificationSuccessResponse;
import com.parknexus.NotificationService.dto.event.RegisterEmailEvent;
import com.parknexus.NotificationService.lib.OneSignal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class NotificationListener {
    private final OneSignal oneSignal;

    @RabbitListener(queues = "${rabbitmq.queue.registration}")
    public void handleRegisterEmailEvent(RegisterEmailEvent event) {
        log.info("---------------- register evt");

        CreateNotificationSuccessResponse response = oneSignal.sendRegisterEmail(
                event.getEmail(),
                event.getOtp(),
                event.getTtlMinutes());

        if (response != null) {
            log.info("register mail sent");
            return;
        }

        log.error("error sending register mail");
    }

    @RabbitListener(queues = "${rabbitmq.queue.passwordReset}")
    public void handleForgotPasswordEmailEvent(RegisterEmailEvent event) {
        log.info("---------------- forgotPwd evt");

        CreateNotificationSuccessResponse response = oneSignal.sendForgotPasswordEmail(
                event.getEmail(),
                event.getOtp(),
                event.getTtlMinutes());

        if (response != null) {
            log.info("forgotPwd mail sent");
            return;
        }

        log.error("error sending forgotPwd mail");
    }
}
