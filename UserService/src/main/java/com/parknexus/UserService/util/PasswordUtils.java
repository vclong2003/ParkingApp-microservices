package com.parknexus.UserService.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtils {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String hashPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        return passwordEncoder.encode(rawPassword);
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        if (rawPassword == null || hashedPassword == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
