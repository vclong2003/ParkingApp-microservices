package com.parknexus.UserService.util;

import java.security.PrivateKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.parknexus.UserService.config.SecurityProperties;

import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtils {
    private final SecurityProperties securityProperties;

    public String generateAccessToken(String subject, Map<String, Object> claims) throws Exception {
        PrivateKey privatekey = KeyUtils.parsePrivateKey(securityProperties.jwt().privateKey());
        Integer expiryInMs = securityProperties.accessTokenExpirationMinutes() * 60 * 1000;
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiryInMs))
                .signWith(privatekey)
                .compact();
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    // for testing
    // public Claims getAllClaims(String token) throws Exception {
    // PublicKey publicKey =
    // KeyUtils.parsePublicKey(securityProperties.jwt().publicKey());
    // return Jwts.parser()
    // .verifyWith(publicKey)
    // .build()
    // .parseSignedClaims(token)
    // .getPayload();
    // }
}
