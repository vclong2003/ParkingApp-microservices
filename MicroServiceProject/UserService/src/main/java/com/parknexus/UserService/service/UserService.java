package com.parknexus.UserService.service;

import org.springframework.stereotype.Service;

import com.parknexus.UserService.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;

}
