package com.vti.AuthService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vti.AuthService.entity.Account;

public interface IAccountRepository extends JpaRepository<Account, Short> {
    Account findByUsername(String username);

    boolean existsByUsername(String username);

}
