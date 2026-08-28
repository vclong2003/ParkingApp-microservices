package com.vti.APIGateway.authen;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.HandlerFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtAuthenticationFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {
    private static final String SECRET_STRING = "mySuperSecretKeyThatIsLongEnoughForHS256Encoding123456";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));

    @Override
    public ServerResponse filter(ServerRequest request, HandlerFunction<ServerResponse> next) throws Exception {
        String path = request.uri().getPath();

        // Bypass JWT for login and register
        if (path.contains("/api/v1/auth/login") || path.contains("/api/v1/auth/register")) {
            return next.handle(request);
        }

        String authHeader = request.headers().firstHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token);
                return next.handle(request);
            } catch (Exception e) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).body("Invalid JWT token");
            }
        }

        return ServerResponse.status(HttpStatus.UNAUTHORIZED).body("Missing Authorization Header");
    }
}
