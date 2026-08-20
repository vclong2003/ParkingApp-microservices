package com.vti.AccountService.dto;

import java.time.LocalDateTime;

import com.vti.AccountService.entity.Account;
import com.vti.AccountService.entity.Department;
import com.vti.AccountService.entity.Position;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class AccountDto {
    private short id;
    private String email;
    private String username;
    private String fullname;
    private LocalDateTime createDate;
    private Department department;
    private Position position;

    public AccountDto(Account entity) {
        this.id = entity.getId();
        this.email = entity.getEmail();
        this.username = entity.getUsername();
        this.fullname = entity.getFullname();
        this.createDate = entity.getCreateDate();
        this.department = entity.getDepartment();
        this.position = entity.getPosition();
    }
}
