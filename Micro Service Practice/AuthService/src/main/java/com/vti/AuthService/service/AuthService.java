package com.vti.AuthService.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vti.AuthService.authen.JwtUtil;
import com.vti.AuthService.entity.Account;
import com.vti.AuthService.entity.Department;
import com.vti.AuthService.entity.Position;
import com.vti.AuthService.form.AuthRequest;
import com.vti.AuthService.form.RegisterRequest;
import com.vti.AuthService.repository.IAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final IAccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String login(AuthRequest request) {
        Account acc_login = accountRepository.findByUsername(request.getUsername());
        if (acc_login == null) {
            throw new RuntimeException("Account not found");
        }

        if (!passwordEncoder.matches(request.getPassword(), acc_login.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(acc_login.getUsername());

        return token;
    }

    public Account register(RegisterRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Account account = new Account();
        account.setUsername(request.getUsername());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setEmail(request.getEmail());
        account.setFullname(request.getFullname());

        Department department = new Department();
        department.setId(request.getDepartmentId());
        account.setDepartment(department);

        Position position = new Position();
        position.setId(request.getPositionId());
        account.setPosition(position);

        Account accountRegister = accountRepository.save(account);

        return accountRegister;
    }

}
