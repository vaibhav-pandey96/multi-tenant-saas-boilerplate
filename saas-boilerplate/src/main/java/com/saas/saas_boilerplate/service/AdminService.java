package com.saas.saas_boilerplate.service;

import com.saas.saas_boilerplate.dto.TenantSummaryResponse;
import com.saas.saas_boilerplate.dto.UserProfileResponse;
import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.model.User;
import com.saas.saas_boilerplate.repository.ApiUsageLogRepository;
import com.saas.saas_boilerplate.repository.TenantRepository;
import com.saas.saas_boilerplate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final ApiUsageLogRepository apiUsageLogRepository;

    // Get currently logged-in user
    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // Convert User -> DTO
    private UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .companyName(user.getTenant().getName())
                .plan(user.getTenant().getPlan().name())
                .build();
    }

    // ===========================
    // TENANT ADMIN METHODS
    // ===========================

    @Transactional
    public List<UserProfileResponse> getUsersInMyTenant() {

        User currentUser = getCurrentUser();
        Tenant myTenant = currentUser.getTenant();

        return userRepository.findByTenant(myTenant)
                .stream()
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse getUserByIdInMyTenant(Long id) {

        User currentUser = getCurrentUser();

        User targetUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!targetUser.getTenant().getId()
                .equals(currentUser.getTenant().getId())) {
            throw new RuntimeException("User not in your tenant!");
        }

        return toProfileResponse(targetUser);
    }

    @Transactional
    public UserProfileResponse changeUserRoleInMyTenant(
            Long id,
            String newRole) {

        User currentUser = getCurrentUser();

        User targetUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!targetUser.getTenant().getId()
                .equals(currentUser.getTenant().getId())) {
            throw new RuntimeException("User not in your tenant!");
        }

        targetUser.setRole(User.Role.valueOf(newRole));

        userRepository.save(targetUser);

        return toProfileResponse(targetUser);
    }

    @Transactional
    public void deleteUserFromTenant(Long id) {

        User currentUser = getCurrentUser();

        User targetUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!targetUser.getTenant().getId()
                .equals(currentUser.getTenant().getId())) {
            throw new RuntimeException("User not in your tenant!");
        }

        // Delete dependent API logs first
        apiUsageLogRepository.deleteByUser(targetUser);

        // Now delete the user
        userRepository.delete(targetUser);
    }

    // ===========================
    // SUPER ADMIN METHODS
    // ===========================

    @Transactional
    public List<TenantSummaryResponse> getAllTenantsWithUsage() {

        return tenantRepository.findAll()
                .stream()
                .map(tenant -> TenantSummaryResponse.builder()
                        .id(tenant.getId())
                        .name(tenant.getName())
                        .plan(tenant.getPlan().name())
                        .userCount((long) userRepository.findByTenant(tenant).size())
                        .apiCallCount(apiUsageLogRepository.countByTenant(tenant))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UserProfileResponse> getUsersByTenantId(Long tenantId) {

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() ->
                        new RuntimeException("Tenant not found"));

        return userRepository.findByTenant(tenant)
                .stream()
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse changeUserRoleAsSuperAdmin(
            Long id,
            String newRole) {
    	
    	User currentUser = getCurrentUser();

        User targetUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (targetUser.getId().equals(currentUser.getId())) {
            throw new RuntimeException("You cannot change your own role.");
        }
        
        targetUser.setRole(User.Role.valueOf(newRole));

        userRepository.save(targetUser);

        return toProfileResponse(targetUser);
    }
}