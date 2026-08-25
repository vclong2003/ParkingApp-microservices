package com.parknexus.UserService.form;

import com.parknexus.UserService.enums.UserGender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserForm {
    @NotBlank(message = "Firstname cannot be blank")
    private String firstname;

    @NotBlank(message = "Lastname cannot be blank")
    private String lastname;

    @NotBlank(message = "Phone cannot be blank")
    private String phone;

    private String avatarUrl;

    @NotNull(message = "Gender cannot be null")
    private UserGender gender;

    // private String stripeCustomerId;
    // private String stripeAccountId;
}
