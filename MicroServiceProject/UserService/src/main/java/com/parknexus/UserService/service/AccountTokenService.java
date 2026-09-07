package com.parknexus.UserService.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.parknexus.Common.enums.AccountRole;
import com.parknexus.UserService.entity.Account;
import com.parknexus.UserService.entity.AccountToken;
import com.parknexus.UserService.repository.IAccountTokenRepository;
import com.parknexus.UserService.util.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountTokenService {
    private final IAccountTokenRepository tokenRepository;

    private final JwtUtils jwtUtils;

    public String genAndSaveRefreshToken(Integer accountId, Integer userId, AccountRole accountRole) {
        AccountToken newAccountToken = new AccountToken();

        String token = jwtUtils.generateRefreshToken();

        newAccountToken.setAccountId(accountId);
        newAccountToken.setUserId(userId);
        newAccountToken.setAccountRole(accountRole);
        newAccountToken.setToken(token);
        newAccountToken.setCreatedAt(LocalDateTime.now());

        tokenRepository.save(newAccountToken);

        return token;
    }

    public String genAccessToken(Integer accountId, Integer userId, AccountRole accountRole) {
        Map<String, Object> tokenPayload = new HashMap<>();
        tokenPayload.put("accountId", accountId);
        tokenPayload.put("role", accountRole);
        if (userId != null) {
            tokenPayload.put("userId", userId);
        }

        try {
            return jwtUtils.generateAccessToken(accountId.toString(), tokenPayload);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to generate access token");
        }
    }

    public void revokeRefreshToken(String refreshToken) {
        tokenRepository.deleteById(refreshToken);
    }

    public String refreshAccessToken(String refreshToken) {
        AccountToken accountToken = tokenRepository.findById(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired refresh token"));
        return genAccessToken(accountToken.getAccountId(), accountToken.getUserId(), accountToken.getAccountRole());
    }
}
