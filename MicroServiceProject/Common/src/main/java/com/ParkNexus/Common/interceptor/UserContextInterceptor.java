package com.ParkNexus.Common.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.ParkNexus.Common.context.UserContext;
import com.ParkNexus.Common.enums.AccountRole;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class UserContextInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accountId = request.getHeader("X-Account-Id");
        String accountRole = request.getHeader("X-Account-Role");

        if (accountId != null) {
            UserContext context = UserContext.builder()
                    .accountId(accountId)
                    .accountRole(AccountRole.valueOf(accountRole))
                    .build();
            UserContext.set(context);
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
            Exception ex) {
        UserContext.clear();
    }
}
