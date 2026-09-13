package com.parknexus.UserService.repository;

import org.springframework.data.repository.CrudRepository;

import com.parknexus.UserService.entity.EmailOtp;

public interface IEmailOtpRepository extends CrudRepository<EmailOtp, String> {

}
