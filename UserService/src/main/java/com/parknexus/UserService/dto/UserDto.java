package com.parknexus.UserService.dto;

import java.time.LocalDateTime;
import com.parknexus.UserService.entity.User;
import com.parknexus.UserService.enums.UserGender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Integer id;
    private String firstname;
    private String lastname;
    private String phone;
    private String avatarUrl;
    private UserGender gender = UserGender.Other;
    // private String stripeCustomerId;
    // private String stripeAccountId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserDto(User entity) {
        this.id = entity.getId();
        this.firstname = entity.getFirstname();
        this.lastname = entity.getLastname();
        this.phone = entity.getPhone();
        this.avatarUrl = entity.getAvatarUrl();
        this.gender = entity.getGender();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}
