package com.parknexus.NotificationService.lib;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.onesignal.client.api.DefaultApi;
import com.onesignal.client.model.CreateNotificationSuccessResponse;
import com.onesignal.client.model.Notification;
import com.parknexus.NotificationService.config.OneSignalConfig;
import com.parknexus.NotificationService.config.OneSignalProperties;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OneSignal {
    private final OneSignalProperties oneSignalProperties;
    private final OneSignalConfig oneSignalConfig;

    public CreateNotificationSuccessResponse sendRegisterEmail(String email, String rawOtp, Integer ttlInMinutes) {
        DefaultApi client = oneSignalConfig.defaultApi();

        List<String> emailList = List.of(email);
        Map<String, Object> customData = new HashMap<>();
        customData.put("user_email", email);
        customData.put("expire_minutes", ttlInMinutes);
        customData.put("otp", rawOtp);

        Notification notification = new Notification();
        notification.setAppId(oneSignalProperties.appId());
        notification.setIncludeEmailTokens(emailList);
        notification.setCustomData(customData);
        notification.setTemplateId(oneSignalProperties.templates().registerOtp());

        try {
            return client.createNotification(notification);
        } catch (Exception e) {
            return null;
        }

    }
}
