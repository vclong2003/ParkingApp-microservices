package com.vti.AccountService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vti.AccountService.entity.Account;

public interface IAccountRepository extends JpaRepository<Account, Short> {

}
