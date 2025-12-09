package com.meti.roombooking.controller;

import com.meti.roombooking.dto.auth.LoginRequest;
import com.meti.roombooking.dto.auth.UserRegistrationRequest;
import com.meti.roombooking.dto.auth.UserResponse;
import com.meti.roombooking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        String result = userService.login(request);
        return ResponseEntity.ok(result);
    }
}
