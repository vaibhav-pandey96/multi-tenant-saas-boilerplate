package com.saas.saas_boilerplate.service;

import com.saas.saas_boilerplate.dto.UserProfileResponse;
import com.saas.saas_boilerplate.model.User;
import com.saas.saas_boilerplate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Get current logged-in user from JWT
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/user/me — any logged-in user can call this
    @Transactional
    public UserProfileResponse getMyProfile() {
        User user = getCurrentUser();

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .companyName(user.getTenant().getName())
                .plan(user.getTenant().getPlan().name())
                .build();
    }
}