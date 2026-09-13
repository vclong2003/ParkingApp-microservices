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
public class ResetPasswordForm {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String newPassword;

    @Size(min = 6, max = 6)
    @NotBlank
    private String otp;
}
