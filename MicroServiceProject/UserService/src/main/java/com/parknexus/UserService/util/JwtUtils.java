package com.parknexus.UserService.util;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.parknexus.UserService.config.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtils {
    private final JwtProperties jwtProperties;

    private final long ACCESS_TOKEN_EXPIRATION_MS = 15 * 60 * 1000; // temp

    public String generateAccessToken(String subject, Map<String, Object> claims) throws Exception {
        PrivateKey privatekey = KeyUtils.parsePrivateKey(jwtProperties.privateKey());
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_MS))
                .signWith(privatekey)
                .compact();
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    public Claims getAllClaims(String token) throws Exception {
        PublicKey publicKey = KeyUtils.parsePublicKey(jwtProperties.publicKey());
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
