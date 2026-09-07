package com.parknexus.UserService.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import com.parknexus.Common.enums.AccountRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash
public class AccountToken implements Serializable {
    @Id
    private String token;

    @Indexed
    private Integer accountId;

    private Integer userId;

    private AccountRole accountRole;

    private LocalDateTime createdAt = LocalDateTime.now();

    @TimeToLive
    private Long ttlInSeconds = 604800L; // 7 days
}
