package com.parknexus.UserService.repository;

import org.springframework.data.repository.CrudRepository;

import com.parknexus.UserService.entity.AccountToken;

public interface IAccountTokenRepository extends CrudRepository<AccountToken, String> {

}
