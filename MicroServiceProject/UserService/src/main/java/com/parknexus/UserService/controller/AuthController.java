package com.parknexus.UserService.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.Common.annotation.RequireRole;
import com.parknexus.Common.context.AccountContext;
import com.parknexus.Common.enums.AccountRole;
import com.parknexus.UserService.dto.TokenPairDto;
import com.parknexus.UserService.form.ForgotPasswordForm;
import com.parknexus.UserService.form.LoginForm;
import com.parknexus.UserService.form.RegisterForm;
import com.parknexus.UserService.form.ResetPasswordForm;
import com.parknexus.UserService.form.VerifyAccountForm;
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
    public ResponseEntity<String> verifyByEmailOtp(@Valid @RequestBody VerifyAccountForm form) {
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

    @PostMapping("forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordForm form) {
        authService.forgotPassword(form);
        return ResponseEntity.ok().build();
    }

    @PostMapping("reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordForm form) {
        authService.resetPassword(form);
        return ResponseEntity.ok().build();
    }

    @RequireRole({ AccountRole.User })
    @GetMapping("test")
    public ResponseEntity<Map<String, Object>> testAuth() {
        AccountContext currentAccount = AccountContext.get();

        Map<String, Object> response = new HashMap<>();
        response.put("accountId", currentAccount.getAccountId());
        response.put("accountRole", currentAccount.getAccountRole().toString());

        return ResponseEntity.ok(response);
    }
}
