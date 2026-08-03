package com.saas.saas_boilerplate.service;

import com.saas.saas_boilerplate.dto.ChangePlanRequest;
import com.saas.saas_boilerplate.dto.CompanyDetailsResponse;
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
    
    private CompanyDetailsResponse toCompanyDetailsResponse(Tenant tenant) {

        long userCount = userRepository.findByTenant(tenant).size();

        long apiCallCount = apiUsageLogRepository.countByTenant(tenant);

        return CompanyDetailsResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .plan(tenant.getPlan().name())
                .status(tenant.getStatus().name())
                .createdAt(tenant.getCreatedAt())
                .userCount(userCount)
                .apiCallCount(apiUsageLogRepository.countByTenant(tenant))
                .build();
    }
   

    // ==================================================
    // TENANT ADMIN METHODS
    // ==================================================

    @Transactional
    public List<UserProfileResponse> getUsersInMyTenant() {

        User currentUser = getCurrentUser();
        Tenant myTenant = currentUser.getTenant();

        return userRepository.findByTenant(myTenant)
                .stream()
                .filter(user -> user.getRole() != User.Role.SUPER_ADMIN)
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

        if (targetUser.getRole() == User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Cannot access Super Admin.");
        }

        return toProfileResponse(targetUser);
    }

    @Transactional
    public UserProfileResponse transferAdminRights(Long newAdminId) {

        User currentAdmin = getCurrentUser();

        // Only Tenant Admin can transfer ownership
        if (currentAdmin.getRole() != User.Role.ADMIN) {
            throw new RuntimeException(
                    "Only the Tenant Admin can transfer ownership."
            );
        }

        User newAdmin = userRepository.findById(newAdminId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Must belong to same tenant
        if (!newAdmin.getTenant().getId()
                .equals(currentAdmin.getTenant().getId())) {
            throw new RuntimeException("User not in your tenant!");
        }

        // Cannot transfer to yourself
        if (newAdmin.getId().equals(currentAdmin.getId())) {
            throw new RuntimeException(
                    "You are already the Tenant Admin."
            );
        }

        // Cannot transfer to SUPER_ADMIN
        if (newAdmin.getRole() == User.Role.SUPER_ADMIN) {
            throw new RuntimeException(
                    "Cannot transfer ownership to Super Admin."
            );
        }

        // Already Admin
        if (newAdmin.getRole() == User.Role.ADMIN) {
            throw new RuntimeException(
                    "This user is already the Tenant Admin."
            );
        }

        // Transfer ownership
        currentAdmin.setRole(User.Role.USER);
        newAdmin.setRole(User.Role.ADMIN);

        userRepository.save(currentAdmin);
        userRepository.save(newAdmin);

        return toProfileResponse(newAdmin);
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

        // Admin cannot delete himself
        if (targetUser.getId().equals(currentUser.getId())) {
            throw new RuntimeException(
                    "You cannot delete yourself."
            );
        }

        // Never delete Super Admin
        if (targetUser.getRole() == User.Role.SUPER_ADMIN) {
            throw new RuntimeException(
                    "Cannot delete Super Admin."
            );
        }

        // Tenant Admin cannot be deleted
        if (targetUser.getRole() == User.Role.ADMIN) {
            throw new RuntimeException(
                    "Tenant Admin cannot be deleted. Transfer ownership first."
            );
        }

        apiUsageLogRepository.deleteByUser(targetUser);

        userRepository.delete(targetUser);
    }

    // ==================================================
    // SUPER ADMIN METHODS
    // ==================================================

    @Transactional
    public List<TenantSummaryResponse> getAllTenantsWithUsage() {

        return tenantRepository.findAll()
                .stream()
                .map(tenant -> TenantSummaryResponse.builder()
                        .id(tenant.getId())
                        .name(tenant.getName())
                        .plan(tenant.getPlan().name())
                        .status(tenant.getStatus().name())
                        .createdAt(tenant.getCreatedAt())
                        .userCount(
                                (long) userRepository.findByTenant(tenant).size()
                        )
                        .apiCallCount(
                                apiUsageLogRepository.countByTenant(tenant)
                        )
                        .build())
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CompanyDetailsResponse getCompanyDetails(Long tenantId) {

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() ->
                        new RuntimeException("Company not found."));

        return toCompanyDetailsResponse(tenant);
    }
    
    @Transactional
    public CompanyDetailsResponse changeCompanyPlan(
            Long tenantId,
            ChangePlanRequest request) {

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() ->
                        new RuntimeException("Company not found."));

        Tenant.Plan newPlan;

        try {

            newPlan = Tenant.Plan.valueOf(
                    request.getPlan().toUpperCase()
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid plan: " + request.getPlan()
            );

        }

        // Already on same plan
        if (tenant.getPlan() == newPlan) {
            throw new RuntimeException(
                    "Company is already on the " + newPlan + " plan."
            );
        }

        tenant.setPlan(newPlan);

        tenantRepository.save(tenant);

        return toCompanyDetailsResponse(tenant);
    }
}