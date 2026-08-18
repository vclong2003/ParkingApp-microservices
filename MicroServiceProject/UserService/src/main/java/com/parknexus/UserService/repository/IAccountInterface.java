package com.parknexus.UserService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.UserService.entity.Account;

public interface IAccountInterface extends JpaRepository<Account, Integer> {

}
