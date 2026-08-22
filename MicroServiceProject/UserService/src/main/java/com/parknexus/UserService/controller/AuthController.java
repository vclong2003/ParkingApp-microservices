package com.parknexus.UserService.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.UserService.dto.TokenPairDto;
import com.parknexus.UserService.form.LoginForm;
import com.parknexus.UserService.form.RegisterForm;
import com.parknexus.UserService.form.VerifyEmailOtpForm;
import com.parknexus.UserService.service.AccountTokenService;
import com.parknexus.UserService.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AccountTokenService accountTokenService;

    @PostMapping("register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterForm form) {
        authService.register(form);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("verify")
    public ResponseEntity<String> verifyByEmailOtp(@Valid @RequestBody VerifyEmailOtpForm form) {
        authService.verifyAccount(form);
        return ResponseEntity.ok("Ok");
    }

    @PostMapping("login")
    public ResponseEntity<TokenPairDto> login(@Valid @RequestBody LoginForm form) {
        TokenPairDto tokens = authService.login(form);
        return ResponseEntity.ok(tokens);
    }

    @GetMapping("refresh")
    public ResponseEntity<TokenPairDto> getNewAccessToken(@RequestParam String refreshToken) {
        TokenPairDto tokens = authService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(tokens);
    }

    @GetMapping("test")
    public ResponseEntity<Map<String, Object>> testToken(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }

        String accessToken = authHeader.substring(7);
        Map<String, Object> claims = accountTokenService.extractTokenPayload(accessToken);
        return ResponseEntity.ok(claims);
    }
}
