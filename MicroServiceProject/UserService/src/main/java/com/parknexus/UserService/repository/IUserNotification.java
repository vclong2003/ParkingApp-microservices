package com.parknexus.UserService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.UserService.entity.UserNotification;

public interface IUserNotification extends JpaRepository<UserNotification, Integer> {

}
