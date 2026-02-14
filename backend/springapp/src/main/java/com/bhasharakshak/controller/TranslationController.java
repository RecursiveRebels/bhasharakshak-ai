package com.bhasharakshak.controller;

import com.bhasharakshak.model.LanguageAsset;
import org.springframework.beans.factory.annotation.Value;
import com.bhasharakshak.repository.AssetRepository;
import com.bhasharakshak.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/translate")
@RequiredArgsConstructor
public class TranslationController {

    private final AssetRepository assetRepository;
    private final AIService aiService;

    @GetMapping("/pending")
    public ResponseEntity<List<LanguageAsset>> getPendingAssets() {
        List<LanguageAsset> pending = assetRepository.findByStatus("pending");
        // Ensure private assets are strictly filtered out from public review
        List<LanguageAsset> publicPending = pending.stream()
                .filter(asset -> !asset.isPrivate())
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(publicPending);
    }

    @Value("${app.admin-pin}")
    private String adminPin;

    @DeleteMapping("/{assetId}")
    public ResponseEntity<?> deleteAsset(
            @PathVariable String assetId,
            @RequestHeader(value = "X-Admin-Pin", required = false) String pin) {

        if (pin == null || !java.util.Objects.equals(pin, adminPin)) {
            return ResponseEntity.status(403).body(Map.of("error", "Invalid Admin PIN"));
        }

        if (!assetRepository.existsById(java.util.Objects.requireNonNull(assetId))) {
            return ResponseEntity.notFound().build();
        }
        assetRepository.deleteById(assetId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{assetId}")
    public ResponseEntity<?> saveTranslation(
            @PathVariable String assetId,
            @RequestBody Map<String, String> payload) {
        LanguageAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        String manualTranslation = payload.get("englishTranslation");

        asset.setEnglishTranslation(manualTranslation);
        asset.setStatus("verified");
        asset.setUpdatedAt(LocalDateTime.now());

        assetRepository.save(asset);
        return ResponseEntity.ok(asset);
    }

    @PostMapping("/auto/{assetId}")
    public ResponseEntity<?> autoTranslate(
            @PathVariable String assetId,
            @RequestParam(defaultValue = "English") String targetLang) {

        LanguageAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (asset.getTranscript() == null || asset.getTranscript().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No transcript available"));
        }

        try {
            String translated = aiService.translateText(asset.getTranscript(), targetLang, asset.getLanguageName());
            return ResponseEntity.ok(Map.of("translatedText", translated));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(503).body(Map.of("error", "AI Service Unavailable"));
        }
    }

    @PostMapping("/tts")
    public ResponseEntity<?> generateAudio(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        String lang = payload.get("lang");

        try {
            String audioData = aiService.generateSpeech(text, lang);
            return ResponseEntity.ok(Map.of("audioData", audioData));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("error", "TTS Service Unavailable"));
        }
    }
}
