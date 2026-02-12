package com.bhasharakshak.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProfanityFilter {

    private final Map<String, Set<String>> profanityWords;
    private final Map<String, Pattern> profanityPatterns;

    public ProfanityFilter() {
        this.profanityWords = new HashMap<>();
        this.profanityPatterns = new HashMap<>();
        loadProfanityWords();
        compileProfanityPatterns();
    }

    private void loadProfanityWords() {
        // English profanity
        profanityWords.put("en", new HashSet<>(Arrays.asList(
                "fuck", "shit", "damn", "bitch", "ass", "bastard", "crap", "piss",
                "dick", "cock", "pussy", "whore", "slut", "fag", "nigger", "retard",
                "motherfucker", "asshole", "bullshit", "goddamn", "hell", "cunt")));

        // Hindi profanity (Devanagari script)
        profanityWords.put("hi", new HashSet<>(Arrays.asList(
                "बकवास", "गधा", "कुत्ता", "साला", "हरामी", "चूतिया", "मादरचोद",
                "भोसड़ी", "रंडी", "लौड़ा", "गांड", "चूत", "बहनचोद")));

        // Tamil profanity
        profanityWords.put("ta", new HashSet<>(Arrays.asList(
                "முட்டாள்", "நாய்", "பன்னி", "ஓழ்", "தேவிடியா", "கூதி", "சூத்து",
                "லூசு", "போடா", "போடி", "ஓம்மல்")));

        // Telugu profanity
        profanityWords.put("te", new HashSet<>(Arrays.asList(
                "దెంగు", "బూతు", "కుక్క", "గాడిద", "పిచ్చి", "లంజ", "బొంద",
                "తల్లి", "పూకు", "సొల్లు")));

        // Kannada profanity
        profanityWords.put("kn", new HashSet<>(Arrays.asList(
                "ಬೂತು", "ನಾಯಿ", "ಕತ್ತೆ", "ಹುಚ್ಚ", "ಲೂಸು", "ಗುಂಡ", "ತುಣ್ಣಿ",
                "ಕಾಮುಕ", "ಬೇವರ್ಸಿ")));

        // Malayalam profanity
        profanityWords.put("ml", new HashSet<>(Arrays.asList(
                "മൈര്", "പൂറ്", "കുണ്ണ", "തായോളി", "പട്ടി", "ചാണകം", "തേവിടിച്ചി",
                "പൂര്", "മോന്ത", "ഊമ്പ്")));

        // Bengali profanity
        profanityWords.put("bn", new HashSet<>(Arrays.asList(
                "শালা", "মাগি", "চোদা", "বাল", "গাধা", "হারামি", "কুত্তা",
                "বেশ্যা", "ভোদা", "লাউড়া")));

        // Gujarati profanity
        profanityWords.put("gu", new HashSet<>(Arrays.asList(
                "ગધેડો", "કૂતરો", "ચૂતિયા", "હરામી", "રાંડ", "લોડો", "ગાંડ",
                "બકવાસ", "પાગલ")));

        // Marathi profanity
        profanityWords.put("mr", new HashSet<>(Arrays.asList(
                "झवाडा", "रांड", "गांड", "लवडा", "भोसडी", "चूत", "मादरचोद",
                "कुत्रा", "गधव", "हरामी")));

        // Khasi profanity (basic - to be expanded)
        profanityWords.put("kha", new HashSet<>(Arrays.asList(
                "khlaw", "sniaw", "pyllait", "bnai")));
    }

    private void compileProfanityPatterns() {
        for (Map.Entry<String, Set<String>> entry : profanityWords.entrySet()) {
            String language = entry.getKey();
            Set<String> words = entry.getValue();

            // Create regex pattern for each language
            String patternString = words.stream()
                    .map(word -> "\\b" + Pattern.quote(word) + "\\b")
                    .collect(Collectors.joining("|"));

            profanityPatterns.put(language,
                    Pattern.compile(patternString, Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE));
        }
    }

    /**
     * Check if text contains profanity in any supported language
     */
    public boolean containsProfanity(String text) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }

        String normalizedText = text.toLowerCase().trim();

        // Check against all language patterns
        for (Pattern pattern : profanityPatterns.values()) {
            if (pattern.matcher(normalizedText).find()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if text contains profanity in a specific language
     */
    public boolean containsProfanity(String text, String languageCode) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }

        Pattern pattern = profanityPatterns.get(languageCode);
        if (pattern == null) {
            // If language not supported, check against all languages
            return containsProfanity(text);
        }

        return pattern.matcher(text.toLowerCase().trim()).find();
    }

    /**
     * Find all profanity words in the text
     */
    public List<String> findProfanity(String text) {
        List<String> foundWords = new ArrayList<>();

        if (text == null || text.trim().isEmpty()) {
            return foundWords;
        }

        String normalizedText = text.toLowerCase().trim();

        for (Set<String> words : profanityWords.values()) {
            for (String word : words) {
                Pattern pattern = Pattern.compile("\\b" + Pattern.quote(word) + "\\b",
                        Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
                if (pattern.matcher(normalizedText).find()) {
                    foundWords.add(word);
                }
            }
        }

        return foundWords;
    }

    /**
     * Censor profanity in text by replacing with asterisks
     */
    public String censorText(String text) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }

        String result = text;

        for (Pattern pattern : profanityPatterns.values()) {
            result = pattern.matcher(result).replaceAll(match -> {
                String word = match.group();
                return word.charAt(0) + "*".repeat(word.length() - 1);
            });
        }

        return result;
    }

    /**
     * Get supported languages for profanity filtering
     */
    public Set<String> getSupportedLanguages() {
        return profanityWords.keySet();
    }

    /**
     * Validate text and return validation result
     */
    public ValidationResult validate(String text) {
        if (containsProfanity(text)) {
            List<String> found = findProfanity(text);
            return new ValidationResult(false,
                    "Content contains inappropriate language: " + String.join(", ", found),
                    found);
        }
        return new ValidationResult(true, "Content is appropriate", Collections.emptyList());
    }

    /**
     * Validation result class
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final List<String> foundWords;

        public ValidationResult(boolean valid, String message, List<String> foundWords) {
            this.valid = valid;
            this.message = message;
            this.foundWords = foundWords;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public List<String> getFoundWords() {
            return foundWords;
        }
    }
}
