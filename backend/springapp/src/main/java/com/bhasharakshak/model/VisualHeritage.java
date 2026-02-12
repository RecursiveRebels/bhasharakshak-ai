package com.bhasharakshak.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "visual_heritage")
public class VisualHeritage {
    @Id
    private String id;

    private String title;
    private String imageUrl; // GridFS URL or ID

    private String originalDescription;
    private String language; // Language of the original description

    // Auto-generated translations of the description
    private Map<String, String> translations;

    private String contributorId; // Anonymized
    private String region;

    private String status; // "pending", "verified"

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
