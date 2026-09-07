package com.parknexus.UserService.service;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.parknexus.Common.util.ObjectUtils;
import com.parknexus.UserService.entity.Account;
import com.parknexus.UserService.entity.User;
import com.parknexus.UserService.form.CreateUserForm;
import com.parknexus.UserService.form.UpdateUserForm;
import com.parknexus.UserService.repository.IAccountRepository;
import com.parknexus.UserService.repository.IUserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final IAccountRepository accountRepository;

    public User createUser(Integer accountId, CreateUserForm form) {
        log.info("0 -----------" + accountId.toString());

        userRepository.findByAccountId(accountId).ifPresent(u -> {
            throw new IllegalArgumentException("User already exist");
        });

        log.info("1 -----------" + accountId.toString());

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with ID: " + accountId));

        log.info("2 ----------- account: " + account.getEmail());

        User newUser = new User();
        newUser.setAccount(account);
        BeanUtils.copyProperties(form, newUser);

        return userRepository.save(newUser);
    }

    public User updateUser(Integer userId, UpdateUserForm form) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        BeanUtils.copyProperties(form, user, ObjectUtils.getNullPropertyNames(form));

        return userRepository.save(user);
    }

    public User getUserById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return user;
    }
}
