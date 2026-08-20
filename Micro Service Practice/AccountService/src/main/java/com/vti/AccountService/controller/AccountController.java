package com.vti.AccountService.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vti.AccountService.dto.AccountDto;
import com.vti.AccountService.entity.Account;
import com.vti.AccountService.form.CreateAccountForm;
import com.vti.AccountService.service.AccountService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/v1/accounts")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping()
    public ResponseEntity<List<AccountDto>> getAllAccount() {
        List<Account> listAccounts = accountService.getAllAccount();
        List<AccountDto> listAccountDTOs = listAccounts.stream().map(account -> new AccountDto(account)).toList();
        return new ResponseEntity<>(listAccountDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDto> getAccountByID(@PathVariable(name = "id") short id) {
        Account account = accountService.getAccountById(id);
        AccountDto accountDto = new AccountDto(account);

        return new ResponseEntity<>(accountDto, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable(name = "id") short id) {
        accountService.deleteAccount(id);
        return new ResponseEntity<String>("Delete successfully!", HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<AccountDto> createNewAccount(@RequestBody CreateAccountForm form) {
        Account newAccount = accountService.createAccount(form);
        AccountDto newAccountDto = new AccountDto(newAccount);

        return new ResponseEntity<>(newAccountDto, HttpStatus.OK);
    }

}
