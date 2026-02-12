package com.bhasharakshak.controller;

import com.bhasharakshak.model.VisualHeritage;
import com.bhasharakshak.repository.VisualHeritageRepository;
import com.bhasharakshak.service.AIService;
import com.bhasharakshak.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/visual-heritage")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VisualHeritageController {

    private final VisualHeritageRepository repository;
    private final StorageService storageService;
    private final AIService aiService;

    // Supported languages (should ideally be in a config or constant)
    private static final String[] SUPPORTED_LANGUAGES = {
            "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Gujarati", "Marathi", "Dogri"
    };

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeImage(@RequestParam("file") MultipartFile file) {
        try {
            String description = aiService.describeImage(file);
            return ResponseEntity.ok(Map.of("description", description));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Analysis failed: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("language") String language,
            @RequestParam(value = "region", required = false) String region) {

        try {
            // 1. Store File
            String fileId = storageService.storeFile(file);
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/v1/preservation/files/") // Reusing existing file endpoint
                    .path(fileId)
                    .toUriString();

            // 2. Auto-generate description if missing
            if (description == null || description.trim().isEmpty()) {
                try {
                    description = aiService.describeImage(file);
                } catch (Exception e) {
                    description = "Description unavailable.";
                }
            }

            // 3. Generate Translations
            Map<String, String> translations = new HashMap<>();
            translations.put(language, description); // Add original

            // Async translation could be better, but doing sync for simplicity as per plan
            for (String targetLang : SUPPORTED_LANGUAGES) {
                if (!targetLang.equalsIgnoreCase(language)) {
                    try {
                        String translatedText = aiService.translateText(description, targetLang);
                        translations.put(targetLang, translatedText);
                    } catch (Exception e) {
                        System.err.println("Failed to translate to " + targetLang + ": " + e.getMessage());
                    }
                }
            }

            // 3. Save Entity
            VisualHeritage heritage = new VisualHeritage();
            heritage.setTitle(title);
            heritage.setImageUrl(fileUrl); // Storing the full URL
            heritage.setOriginalDescription(description);
            heritage.setLanguage(language);
            heritage.setTranslations(translations);
            heritage.setRegion(region);
            heritage.setContributorId("ANON-" + UUID.randomUUID().toString().substring(0, 8));
            heritage.setStatus("pending"); // Default to pending
            heritage.setCreatedAt(LocalDateTime.now());
            heritage.setUpdatedAt(LocalDateTime.now());

            repository.save(heritage);

            return ResponseEntity.ok(heritage);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<VisualHeritage>> getAllHeritage() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/approved")
    public ResponseEntity<List<VisualHeritage>> getApprovedHeritage() {
        // For development/demo, returning all. In prod, filter by status="verified"
        return ResponseEntity.ok(repository.findAll());
        // return ResponseEntity.ok(repository.findByStatus("verified"));
    }
}
