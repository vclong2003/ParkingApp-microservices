package com.parknexus.UserService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash
public class EmailOtp {
    @Id
    private String email;

    private String hashedOtp;

    @TimeToLive
    private Long ttlInSeconds = 300L; // 5 minutes
}
