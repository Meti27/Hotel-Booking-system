package com.meti.roombooking.service;

import com.meti.roombooking.dto.auth.LoginRequest;
import com.meti.roombooking.dto.auth.UserRegistrationRequest;
import com.meti.roombooking.dto.auth.UserResponse;

public interface UserService {
    UserResponse register(UserRegistrationRequest request);

    //TODO return this as a JWT Token
    String login(LoginRequest request);
    UserResponse getById(Long id);
}
