package com.parknexus.UserService.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.parknexus.UserService.entity.Account;
import com.parknexus.UserService.entity.AccountToken;
import com.parknexus.UserService.repository.IAccountRepository;
import com.parknexus.UserService.repository.IAccountTokenRepository;
import com.parknexus.UserService.util.JwtUtils;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountTokenService {
    private final IAccountTokenRepository tokenRepository;
    private final IAccountRepository accountRepository;

    private final JwtUtils jwtUtils;

    public String genAndSaveRefreshToken(Account account) {
        AccountToken newAccountToken = new AccountToken();

        String token = jwtUtils.generateRefreshToken();

        newAccountToken.setAccountId(account.getId());
        newAccountToken.setToken(token);
        newAccountToken.setCreatedAt(LocalDateTime.now());

        tokenRepository.save(newAccountToken);

        return token;
    }

    public String genAccessToken(Account account) {
        Map<String, Object> tokenPayload = new HashMap<>();
        tokenPayload.put("accountId", account.getId());
        tokenPayload.put("role", account.getRole());

        try {
            return jwtUtils.generateAccessToken(account.getEmail(), tokenPayload);
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
        Account account = accountRepository.findById(accountToken.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        return genAccessToken(account);
    }

    public Map<String, Object> extractTokenPayload(String accessToken) {
        try {
            Claims claims = jwtUtils.getAllClaims(accessToken);
            return new HashMap<>(claims);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or expired access token");
        }
    }
}
