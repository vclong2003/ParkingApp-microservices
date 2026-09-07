package com.parknexus.ReservationService.dto;

import java.time.LocalDateTime;

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
    private String gender;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
