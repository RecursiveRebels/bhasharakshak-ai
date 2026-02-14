package com.bhasharakshak.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@Document(collection = "assets")
public class LanguageAsset {
    @Id
    private String assetId;

    private String contributorId; // Anonymized
    private String languageName;
    private String dialect;
    private String targetLanguage;

    private String transcript; // Original text/transcript
    private String englishTranslation;

    // File paths or URLs
    private String audioUrl;

    private boolean consentGiven;
    private LocalDateTime consentTimestamp;

    // Location tracking for map visualization
    private String region; // State/Region name
    private String city; // City name
    private Double latitude; // Optional GPS coordinates
    private Double longitude; // Optional GPS coordinates

    private String status; // "pending", "verified"

    // Private collections support
    @Field("isPrivate")
    @JsonProperty("isPrivate")
    private boolean isPrivate; // true = private collection, false = public/consented

    @Field("userId")
    private String userId; // Browser-generated unique user ID for private collections

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
