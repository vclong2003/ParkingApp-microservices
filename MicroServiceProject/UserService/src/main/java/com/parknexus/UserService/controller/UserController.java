package com.parknexus.UserService.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/v1/users")
@CrossOrigin("*")
@AllArgsConstructor
public class UserController {

}
