package com.parknexus.ApiGateway.util;

import java.security.PublicKey;

import org.springframework.stereotype.Component;

import com.parknexus.ApiGateway.config.SecurityProperties;
import com.parknexus.ApiGateway.dto.TokenPayloadDto;
import com.parknexus.Common.enums.AccountRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtils {
    private final SecurityProperties securityProperties;

    public TokenPayloadDto extractTokenPayload(String token) throws Exception {
        PublicKey publicKey = KeyUtils.parsePublicKey(securityProperties.jwt().publicKey());

        Claims claims = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String accountId = String.valueOf(claims.get("accountId"));
        String roleStr = claims.get("role", String.class);
        AccountRole role = AccountRole.valueOf(roleStr);

        return new TokenPayloadDto(accountId, role);
    }
}
