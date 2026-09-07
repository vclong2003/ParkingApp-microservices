package com.parknexus.ApiGateway.filter;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import com.parknexus.ApiGateway.config.SecurityProperties;
import com.parknexus.ApiGateway.dto.TokenPayloadDto;
import com.parknexus.ApiGateway.lib.CustomRequestWrapper;
import com.parknexus.ApiGateway.util.JwtUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final SecurityProperties securityProperties;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private boolean isExcluded(String path) {
        if (securityProperties.exclude() == null ||
                securityProperties.exclude().routes() == null) {
            return false;
        }
        return securityProperties.exclude().routes().stream()
                .anyMatch(route -> pathMatcher.match(route, path));
    }

    private String extractHeaderToken(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (isExcluded(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = extractHeaderToken(request);
        if (token == null) {
            log.warn("Auth header is invalid or not present");
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        try {
            TokenPayloadDto payload = jwtUtils.extractTokenPayload(token);
            CustomRequestWrapper requestWrapper = new CustomRequestWrapper(request);
            requestWrapper.addHeader("X-Account-Id", payload.getAccountId());
            requestWrapper.addHeader("X-Account-Role", payload.getRole().name());
            if (payload.getUserId() != null) {
                requestWrapper.addHeader("X-User-Id", payload.getUserId());
            }
            filterChain.doFilter(requestWrapper, response);

        } catch (Exception e) {
            log.warn("Access token is invalid or expired", e);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
        }
    }

}
