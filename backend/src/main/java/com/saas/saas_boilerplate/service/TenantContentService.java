package com.saas.saas_boilerplate.service;

import com.saas.saas_boilerplate.dto.TenantContentResponse;
import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.model.TenantContent;
import com.saas.saas_boilerplate.model.User;
import com.saas.saas_boilerplate.repository.TenantContentRepository;
import com.saas.saas_boilerplate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantContentService {

    // Keep DB-stored files reasonably small (this boilerplate stores files as BLOBs)
    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024; // 10 MB

    private final TenantContentRepository tenantContentRepository;
    private final UserRepository userRepository;

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

    private TenantContentResponse toResponse(TenantContent content) {

        return TenantContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .body(content.getBody())
                .hasFile(content.getFileData() != null)
                .fileName(content.getFileName())
                .fileType(content.getFileType())
                .fileSize(content.getFileSize())
                .uploadedByName(
                        content.getUploadedBy() != null
                                ? content.getUploadedBy().getName()
                                : "Unknown")
                .createdAt(content.getCreatedAt())
                .build();
    }

    // ==================================================
    // TENANT ADMIN: create a post (text, file, or both)
    // ==================================================
    @Transactional
    public TenantContentResponse uploadContent(
            String title,
            String body,
            MultipartFile file) {

        User currentUser = getCurrentUser();

        if (title == null || title.isBlank()) {
            throw new RuntimeException("Title is required.");
        }

        boolean hasBody = body != null && !body.isBlank();
        boolean hasFile = file != null && !file.isEmpty();

        if (!hasBody && !hasFile) {
            throw new RuntimeException(
                    "Add a message or attach a file (or both).");
        }

        TenantContent.TenantContentBuilder builder = TenantContent.builder()
                .title(title.trim())
                .body(hasBody ? body.trim() : null)
                .tenant(currentUser.getTenant())
                .uploadedBy(currentUser);

        if (hasFile) {

            if (file.getSize() > MAX_FILE_SIZE) {
                throw new RuntimeException(
                        "File too large. Max size is 10MB.");
            }

            try {
                builder.fileName(file.getOriginalFilename())
                        .fileType(file.getContentType())
                        .fileSize(file.getSize())
                        .fileData(file.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to read uploaded file.");
            }
        }

        TenantContent saved = tenantContentRepository.save(builder.build());

        return toResponse(saved);
    }

    // ==================================================
    // ANY TENANT USER: view the shared feed for their company
    // ==================================================
    @Transactional
    public List<TenantContentResponse> getContentForMyTenant() {

        User currentUser = getCurrentUser();
        Tenant myTenant = currentUser.getTenant();

        return tenantContentRepository.findByTenantOrderByCreatedAtDesc(myTenant)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ==================================================
    // ANY TENANT USER: download an attached file
    // ==================================================
    @Transactional
    public TenantContent getFileForDownload(Long id) {

        User currentUser = getCurrentUser();

        TenantContent content = tenantContentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Content not found"));

        if (!content.getTenant().getId()
                .equals(currentUser.getTenant().getId())) {
            throw new RuntimeException("This content is not from your company.");
        }

        if (content.getFileData() == null) {
            throw new RuntimeException("This post has no attached file.");
        }

        return content;
    }

    // ==================================================
    // TENANT ADMIN: delete a post
    // ==================================================
    @Transactional
    public void deleteContent(Long id) {

        User currentUser = getCurrentUser();

        TenantContent content = tenantContentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Content not found"));

        if (!content.getTenant().getId()
                .equals(currentUser.getTenant().getId())) {
            throw new RuntimeException("This content is not from your company.");
        }

        tenantContentRepository.delete(content);
    }
}
