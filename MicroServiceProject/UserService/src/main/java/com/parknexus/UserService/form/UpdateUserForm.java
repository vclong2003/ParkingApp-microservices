package com.parknexus.UserService.form;

import com.parknexus.UserService.enums.UserGender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserForm {
    private String firstname;
    private String lastname;
    private String phone;
    private String avatarUrl;
    private UserGender gender;
    // private String stripeCustomerId;
    // private String stripeAccountId;
}
