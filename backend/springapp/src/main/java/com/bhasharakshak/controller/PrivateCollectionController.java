package com.bhasharakshak.controller;

import com.bhasharakshak.model.LanguageAsset;
import com.bhasharakshak.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/my-collections")
@RequiredArgsConstructor
public class PrivateCollectionController {

    private final AssetRepository assetRepository;

    /**
     * Get all private collections for a specific user
     * Optionally filter by language
     */
    @GetMapping
    public ResponseEntity<List<LanguageAsset>> getMyCollections(
            @RequestParam String userId,
            @RequestParam(required = false) String language) {

        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<LanguageAsset> privateAssets = assetRepository.findAll().stream()
                .filter(asset -> asset.isPrivate())
                .filter(asset -> userId.equals(asset.getUserId()))
                .filter(asset -> language == null || language.isEmpty() ||
                        (asset.getLanguageName() != null && asset.getLanguageName().equalsIgnoreCase(language)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(privateAssets);
    }

    /**
     * Get a single private asset by ID
     * Verifies ownership before returning
     */
    @GetMapping("/{id}")
    public ResponseEntity<LanguageAsset> getPrivateAsset(
            @PathVariable String id,
            @RequestParam String userId) {

        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<LanguageAsset> assetOpt = assetRepository.findById(id);

        if (assetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        LanguageAsset asset = assetOpt.get();

        // Verify ownership and privacy
        if (!asset.isPrivate() || !userId.equals(asset.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(asset);
    }

    /**
     * Delete a private asset
     * Verifies ownership before deleting
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrivateAsset(
            @PathVariable String id,
            @RequestParam String userId) {

        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<LanguageAsset> assetOpt = assetRepository.findById(id);

        if (assetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        LanguageAsset asset = assetOpt.get();

        // Verify ownership and privacy
        if (!asset.isPrivate() || !userId.equals(asset.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        assetRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Asset deleted successfully",
                "assetId", id));
    }

    /**
     * Convert a private asset to public
     * Sets isPrivate=false and status=pending for verification
     */
    @PatchMapping("/{id}/make-public")
    public ResponseEntity<?> makePublic(
            @PathVariable String id,
            @RequestParam String userId) {

        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<LanguageAsset> assetOpt = assetRepository.findById(id);

        if (assetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        LanguageAsset asset = assetOpt.get();

        // Verify ownership and privacy
        if (!asset.isPrivate() || !userId.equals(asset.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Convert to public
        asset.setPrivate(false);
        asset.setConsentGiven(true);
        asset.setStatus("pending"); // Needs verification
        asset.setUpdatedAt(LocalDateTime.now());

        assetRepository.save(asset);

        return ResponseEntity.ok(Map.of(
                "message", "Asset is now public and pending verification",
                "asset", asset));
    }

    /**
     * Get count of user's private collections
     */
    @GetMapping("/count")
    public ResponseEntity<?> getPrivateCollectionCount(@RequestParam String userId) {
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        long count = assetRepository.findAll().stream()
                .filter(asset -> asset.isPrivate())
                .filter(asset -> userId.equals(asset.getUserId()))
                .count();

        return ResponseEntity.ok(Map.of("count", count));
    }
}
