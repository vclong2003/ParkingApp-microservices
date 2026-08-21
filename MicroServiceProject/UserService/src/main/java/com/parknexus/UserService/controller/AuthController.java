package com.parknexus.UserService.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.UserService.form.RegisterForm;
import com.parknexus.UserService.form.VerifyEmailOtpForm;
import com.parknexus.UserService.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterForm form) {
        authService.register(form);
        return new ResponseEntity<>("Okkkk", HttpStatus.OK);
    }

    @PostMapping("verify")
    public ResponseEntity<String> verifyByEmailOtp(@Valid @RequestBody VerifyEmailOtpForm form) {
        authService.verifyAccount(form);
        return new ResponseEntity<>("Okkkk", HttpStatus.OK);
    }

}
