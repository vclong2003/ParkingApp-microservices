package com.parknexus.Common.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.parknexus.Common.context.AccountContext;
import com.parknexus.Common.enums.AccountRole;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class UserContextInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accountId = request.getHeader("X-Account-Id");
        String userId = request.getHeader("X-User-Id");
        String accountRole = request.getHeader("X-Account-Role");

        if (accountId != null) {
            AccountContext context = AccountContext.builder()
                    .accountId(Integer.parseInt(accountId))
                    .userId(userId != null ? Integer.parseInt(userId) : null)
                    .accountRole(AccountRole.valueOf(accountRole))
                    .build();
            AccountContext.set(context);
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
            Exception ex) {
        AccountContext.clear();
    }
}
