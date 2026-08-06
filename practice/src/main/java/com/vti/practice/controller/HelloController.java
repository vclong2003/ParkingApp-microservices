package com.vti.practice.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HelloController {
    @GetMapping("/hello")
    public String getHello() {
        return "Hello World!";
    }
}
