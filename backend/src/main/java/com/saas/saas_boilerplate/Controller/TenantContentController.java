package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.TenantContentResponse;
import com.saas.saas_boilerplate.model.TenantContent;
import com.saas.saas_boilerplate.service.TenantContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class TenantContentController {

    private final TenantContentService tenantContentService;

    // Any logged-in user can view their company's shared feed
    @GetMapping
    public ResponseEntity<List<TenantContentResponse>> getMyTenantContent() {

        return ResponseEntity.ok(
                tenantContentService.getContentForMyTenant()
        );
    }

    // Any logged-in user can download an attached file (tenant-checked in service)
    @GetMapping("/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadFile(
            @PathVariable Long id) {

        TenantContent content = tenantContentService.getFileForDownload(id);

        ByteArrayResource resource =
                new ByteArrayResource(content.getFileData());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        content.getFileType() != null
                                ? content.getFileType()
                                : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + content.getFileName() + "\"")
                .contentLength(content.getFileData().length)
                .body(resource);
    }

    // Only the Tenant Admin can post/upload content
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TenantContentResponse> uploadContent(
            @RequestParam("title") String title,
            @RequestParam(value = "body", required = false) String body,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        return ResponseEntity.ok(
                tenantContentService.uploadContent(title, body, file)
        );
    }

    // Only the Tenant Admin can remove a post
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteContent(
            @PathVariable Long id) {

        tenantContentService.deleteContent(id);

        return ResponseEntity.ok("Content deleted successfully.");
    }
}
