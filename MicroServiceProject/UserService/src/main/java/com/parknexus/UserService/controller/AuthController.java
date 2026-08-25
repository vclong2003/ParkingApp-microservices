package com.parknexus.UserService.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.Common.context.AccountContext;
import com.parknexus.UserService.dto.TokenPairDto;
import com.parknexus.UserService.form.LoginForm;
import com.parknexus.UserService.form.RegisterForm;
import com.parknexus.UserService.form.VerifyEmailOtpForm;
import com.parknexus.UserService.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

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
    public ResponseEntity<Map<String, Object>> testAuth() {
        AccountContext currentAccount = AccountContext.get();

        Map<String, Object> response = new HashMap<>();
        response.put("accountId", currentAccount.getAccountId());
        response.put("accountRole", currentAccount.getAccountRole().toString());

        return ResponseEntity.ok(response);
    }
}
