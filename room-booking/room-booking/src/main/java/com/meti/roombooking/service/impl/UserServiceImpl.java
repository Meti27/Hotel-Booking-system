package com.meti.roombooking.service.impl;

import com.meti.roombooking.dto.auth.LoginRequest;
import com.meti.roombooking.dto.auth.UserRegistrationRequest;
import com.meti.roombooking.dto.auth.UserResponse;
import com.meti.roombooking.entity.Role;
import com.meti.roombooking.entity.User;
import com.meti.roombooking.repository.UserRepository;
import com.meti.roombooking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor // generates constructor with all final fields
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse register(UserRegistrationRequest request) {
        // 1) Check if email already used
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        // 2) Map DTO -> Entity
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        // TODO: later we will hash the password, for now store plain text
        user.setPassword(request.getPassword());
        user.setRole(Role.CLIENT); // default new users = CLIENT

        // 3) Save
        User saved = userRepository.save(user);

        // 4) Map Entity -> DTO
        return UserResponse.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .build();
    }

    @Override
    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        // very basic check for now; later: password hashing + JWT
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // For now, just return a dummy string. Later this becomes a JWT token.
        return "LOGIN_OK_FOR_USER_ID_" + user.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
