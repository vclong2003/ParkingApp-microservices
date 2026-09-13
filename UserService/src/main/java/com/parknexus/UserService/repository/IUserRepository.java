package com.parknexus.UserService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.UserService.entity.User;

public interface IUserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByAccountId(Integer accountId);
}
