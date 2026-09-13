package com.parknexus.UserService.dto;

import java.time.LocalDateTime;

import com.parknexus.Common.enums.AccountRole;
import com.parknexus.UserService.entity.Account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountDto {
    private Integer id;
    private String email;
    private Boolean isVerified;
    private AccountRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AccountDto(Account entity) {
        this.id = entity.getId();
        this.email = entity.getEmail();
        this.isVerified = entity.isVerified();
        this.role = entity.getRole();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}
