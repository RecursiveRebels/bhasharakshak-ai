package com.bhasharakshak.controller;

import com.bhasharakshak.model.LanguageAsset;
import com.bhasharakshak.repository.AssetRepository;
import com.bhasharakshak.service.AIService;
import com.bhasharakshak.service.StorageService;
// import com.bhasharakshak.service.ProfanityFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.data.mongodb.gridfs.GridFsResource;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/preservation")
@RequiredArgsConstructor
public class FileUploadController {

    private final StorageService storageService;
    private final AIService aiService;
    private final AssetRepository assetRepository;
    // private final ProfanityFilter profanityFilter;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAudio(
            @RequestParam("file") MultipartFile file,
            @RequestParam("language") String language,
            @RequestParam("dialect") String dialect,
            @RequestParam(value = "targetLanguage", defaultValue = "English") String targetLanguage,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam("consent") boolean consent,
            @RequestParam(value = "isPrivate", defaultValue = "false") boolean isPrivate,
            @RequestParam(value = "userId", required = false) String userId) {
        try {
            System.out.println("=== UPLOAD REQUEST ===");
            System.out.println("Language: " + language + ", IsPrivate: " + isPrivate + ", UserId: " + userId);

            // Validate: if private, userId is required
            if (isPrivate && (userId == null || userId.trim().isEmpty())) {
                return ResponseEntity.badRequest().body("User ID is required for private collections.");
            }

            if (userId != null) {
                userId = userId.trim();
            }

            // Validate: if not private (public), consent is mandatory
            if (!isPrivate && !consent) {
                return ResponseEntity.badRequest().body("Consent is mandatory for public contributions.");
            }

            // TODO: Re-enable profanity filter after backend restart
            // Validate: Check for profanity in language name and dialect
            // if (profanityFilter.containsProfanity(language)) {
            // return ResponseEntity.badRequest().body("Language name contains inappropriate
            // content.");
            // }
            // if (profanityFilter.containsProfanity(dialect)) {
            // return ResponseEntity.badRequest().body("Dialect contains inappropriate
            // content.");
            // }

            // 1. Store File (Returns GridFS ID)
            String fileId = storageService.storeFile(file);
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/v1/preservation/files/")
                    .path(java.util.Objects.requireNonNull(fileId))
                    .toUriString();

            // 2. Perform STT (Safe execution)
            String transcript;
            try {
                transcript = aiService.transcribeAudio(file, language);

                // Validate transcript for profanity
                // if (profanityFilter.containsProfanity(transcript)) {
                // return ResponseEntity.badRequest()
                // .body("Audio transcript contains inappropriate content. Please re-record.");
                // }
            } catch (Exception ex) {
                System.err.println("AI Service unavailable: " + ex.getMessage());
                transcript = "Transcription unavailable (AI Service down)";
            }

            // 3. Create Asset
            LanguageAsset asset = new LanguageAsset();
            asset.setAssetId(UUID.randomUUID().toString());
            asset.setContributorId("ANON-" + UUID.randomUUID().toString().substring(0, 8));
            asset.setLanguageName(language);
            asset.setDialect(dialect);
            asset.setTargetLanguage(targetLanguage);
            asset.setAudioUrl(fileUrl);
            asset.setTranscript(transcript);
            asset.setConsentGiven(consent);
            asset.setConsentTimestamp(LocalDateTime.now());
            asset.setRegion(region);
            asset.setCity(city);

            // Privacy settings
            asset.setPrivate(isPrivate);
            asset.setUserId(isPrivate ? userId : null);

            // Status: private assets don't need verification
            asset.setStatus(isPrivate ? "private" : "pending");
            asset.setCreatedAt(LocalDateTime.now());
            asset.setUpdatedAt(LocalDateTime.now());

            assetRepository.save(asset);

            return ResponseEntity.ok(asset);

        } catch (Exception e) {
            e.printStackTrace();
            java.io.StringWriter sw = new java.io.StringWriter();
            java.io.PrintWriter pw = new java.io.PrintWriter(sw);
            e.printStackTrace(pw);
            return ResponseEntity.internalServerError()
                    .body("Upload failed: " + e.toString() + "\nStack: " + sw.toString());
        }
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<Resource> getFile(@PathVariable String id) {
        GridFsResource resource = storageService.getFile(id);
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(resource.getContentType()))
                .body(resource);
    }
}
