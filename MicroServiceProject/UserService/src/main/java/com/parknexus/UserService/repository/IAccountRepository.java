package com.parknexus.UserService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.UserService.entity.Account;

public interface IAccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findOneByEmail(String email);
}
