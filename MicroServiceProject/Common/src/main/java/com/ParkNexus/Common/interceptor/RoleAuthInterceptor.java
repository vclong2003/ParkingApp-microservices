package com.parknexus.Common.interceptor;

import java.util.Arrays;

import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.parknexus.Common.annotation.RequireRole;
import com.parknexus.Common.context.AccountContext;
import com.parknexus.Common.enums.AccountRole;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RoleAuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) { // ignore if not controller method
            return true;
        }

        String internalHeader = request.getHeader("X-Internal-Request");
        if ("true".equals(internalHeader)) { // ignore if from feign
            return true;
        }

        RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class); // check method role annotation
        if (requireRole == null) {
            requireRole = handlerMethod.getBeanType().getAnnotation(RequireRole.class); // check class role annotation
        }

        if (requireRole == null) { // allow all if no role annotation
            return true;
        }

        AccountContext currentContext = AccountContext.get();
        if (currentContext == null || currentContext.getAccountRole() == null) { // check if user context have data
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        AccountRole userRole = currentContext.getAccountRole();
        boolean hasPermission = Arrays.asList(requireRole.value()).contains(userRole);
        if (!hasPermission) { // check if role allowed
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        return true;
    }
}
