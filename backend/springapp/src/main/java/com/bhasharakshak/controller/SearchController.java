package com.bhasharakshak.controller;

import com.bhasharakshak.model.LanguageAsset;
import com.bhasharakshak.repository.AssetRepository;
import com.bhasharakshak.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SearchController {

    private final AssetRepository assetRepository;
    private final AIService aiService;

    @GetMapping("/search")
    public ResponseEntity<List<LanguageAsset>> searchAssets(
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "false") boolean includeAll) {

        List<LanguageAsset> results;

        if (query == null || query.isEmpty()) {
            results = assetRepository.findAll();
        } else {
            results = assetRepository.findByLanguageNameContainingIgnoreCase(query);
        }

        // Filter to only verified AND public assets unless includeAll is true (for
        // admin purposes)
        if (!includeAll) {
            results = results.stream()
                    .filter(asset -> "verified".equalsIgnoreCase(asset.getStatus()))
                    .filter(asset -> !asset.isPrivate()) // Exclude private collections
                    .collect(java.util.stream.Collectors.toList());
        }

        return ResponseEntity.ok(results);
    }

    @GetMapping("/tts")
    public ResponseEntity<?> generateTTS(@RequestParam String text, @RequestParam(defaultValue = "en") String lang) {
        String audioData = aiService.generateSpeech(text, lang);
        return ResponseEntity.ok(Map.of("audioData", audioData));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<LanguageAsset> allAssets = assetRepository.findAll();

        long totalAssets = allAssets.size();
        // Determine active languages (count by languageName)
        Map<String, Long> languageDistribution = allAssets.stream()
                .filter(asset -> asset.getLanguageName() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        LanguageAsset::getLanguageName,
                        java.util.stream.Collectors.counting()));

        // Simple mock-ish calculation for hours based on standard length (e.g. 10s per
        // clip)
        double totalHours = totalAssets * 10.0 / 3600.0;

        return ResponseEntity.ok(Map.of(
                "totalHours", String.format("%.2f", totalHours),
                "totalAssets", totalAssets,
                "languageCount", languageDistribution.size(),
                "distribution", languageDistribution.entrySet().stream()
                        .map(e -> Map.of("name", e.getKey(), "value", e.getValue()))
                        .sorted((a, b) -> {
                            long valA = ((Number) a.get("value")).longValue();
                            long valB = ((Number) b.get("value")).longValue();
                            return Long.compare(valB, valA);
                        })
                        .limit(5)
                        .collect(java.util.stream.Collectors.toList())));
    }

    @GetMapping("/map-stats")
    public ResponseEntity<?> getMapStats() {
        List<LanguageAsset> allAssets = assetRepository.findAll();

        // Group by city and count contributions
        Map<String, Map<String, Object>> cityStats = new java.util.HashMap<>();

        for (LanguageAsset asset : allAssets) {
            String city = asset.getCity();
            String region = asset.getRegion();

            // Skip if no city/region data
            if (city == null || city.isEmpty())
                continue;

            String key = city + "|" + (region != null ? region : "Unknown");

            if (!cityStats.containsKey(key)) {
                Map<String, Object> stats = new java.util.HashMap<>();
                stats.put("city", city);
                stats.put("region", region != null ? region : "Unknown");
                stats.put("count", 1);
                stats.put("languages", new java.util.HashSet<String>());

                // Add coordinates if available
                if (asset.getLatitude() != null && asset.getLongitude() != null) {
                    stats.put("latitude", asset.getLatitude());
                    stats.put("longitude", asset.getLongitude());
                }

                cityStats.put(key, stats);
            } else {
                Map<String, Object> stats = cityStats.get(key);
                stats.put("count", (Integer) stats.get("count") + 1);
            }

            // Track languages
            if (asset.getLanguageName() != null) {
                @SuppressWarnings("unchecked")
                java.util.Set<String> languages = (java.util.Set<String>) cityStats.get(key).get("languages");
                languages.add(asset.getLanguageName());
            }
        }

        // Convert to list and format
        List<Map<String, Object>> result = cityStats.values().stream()
                .map(stats -> {
                    @SuppressWarnings("unchecked")
                    java.util.Set<String> languages = (java.util.Set<String>) stats.get("languages");
                    stats.put("primaryLanguage", languages.isEmpty() ? "Unknown" : languages.iterator().next());
                    stats.remove("languages"); // Remove the set, keep only primary language
                    return stats;
                })
                .sorted((a, b) -> Integer.compare((Integer) b.get("count"), (Integer) a.get("count")))
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "cities", result,
                "totalCities", result.size(),
                "lastUpdated", java.time.LocalDateTime.now().toString()));
    }
}
