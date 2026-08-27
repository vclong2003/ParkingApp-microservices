package com.parknexus.UserService.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.Common.annotation.RequireRole;
import com.parknexus.Common.context.AccountContext;
import com.parknexus.Common.enums.AccountRole;
import com.parknexus.UserService.dto.UserDto;
import com.parknexus.UserService.entity.User;
import com.parknexus.UserService.form.CreateUserForm;
import com.parknexus.UserService.form.UpdateUserForm;
import com.parknexus.UserService.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Slf4j
@RestController
@RequestMapping("api/v1/users")
@CrossOrigin("*")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("me")
    public ResponseEntity<UserDto> setUpProfile(@Valid @RequestBody CreateUserForm form) {
        AccountContext currentAccount = AccountContext.get();
        User newUser = userService.createUser(currentAccount.getAccountId(), form);
        return ResponseEntity.ok(new UserDto(newUser));
    }

    @PutMapping("me")
    public ResponseEntity<UserDto> updateCurrentProfile(@RequestBody UpdateUserForm entity) {
        AccountContext currentAccount = AccountContext.get();
        User currentUser = userService.updateUser(currentAccount.getAccountId(), entity);
        return ResponseEntity.ok(new UserDto(currentUser));
    }

    @GetMapping("me")
    public ResponseEntity<UserDto> getCurrentProfile() {
        AccountContext currentAccount = AccountContext.get();
        User currentUser = userService.getUserByAccountId(currentAccount.getAccountId());
        return ResponseEntity.ok(new UserDto(currentUser));
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer userId) {
        log.info("here ----------------------------");
        User currentUser = userService.getUserById(userId);
        return ResponseEntity.ok(new UserDto(currentUser));
    }

    @RequireRole({})
    @GetMapping("/account/{accountId}")
    public ResponseEntity<UserDto> getUserByAccountId(@PathVariable Integer accountId) {
        User currentUser = userService.getUserByAccountId(accountId);
        return ResponseEntity.ok(new UserDto(currentUser));
    }

}
