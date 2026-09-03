package com.parknexus.UserService.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerifyAccountForm {
    @Email
    @NotBlank
    private String email;

    @Size(min = 6, max = 6)
    @NotBlank
    private String otp;
}
