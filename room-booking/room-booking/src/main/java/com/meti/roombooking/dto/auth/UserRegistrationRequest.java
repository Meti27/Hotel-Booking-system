package com.meti.roombooking.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegistrationRequest {
    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    //TODO Hash this
    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
