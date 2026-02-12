package com.bhasharakshak.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.client.MultipartBodyBuilder;

import java.util.Map;

@Service
public class AIService {

        private final String AI_SERVICE_URL;
        private final RestClient restClient;
        private final RestTemplate restTemplate;

        public AIService(@Value("${ai-service.url}") String aiServiceUrl) {
                this.AI_SERVICE_URL = aiServiceUrl;
                this.restClient = RestClient.builder()
                                .baseUrl(aiServiceUrl)
                                .build();
                this.restTemplate = new RestTemplate();
        }

        public String transcribeAudio(MultipartFile file, String language) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                MultipartBodyBuilder builder = new MultipartBodyBuilder();
                builder.part("file", file.getResource());
                builder.part("language", language != null ? language : "English");

                HttpEntity<MultiValueMap<String, HttpEntity<?>>> requestEntity = new HttpEntity<>(builder.build(),
                                headers);

                try {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> response = restTemplate.postForObject(
                                        AI_SERVICE_URL + "/stt",
                                        requestEntity,
                                        Map.class);

                        if (response == null) {
                                throw new RuntimeException("STT Service returned null response");
                        }
                        return (String) response.get("transcript");
                } catch (Exception e) {
                        System.err.println("STT Service Error: " + e.getMessage());
                        throw new RuntimeException("STT Failed");
                }
        }

        public String translateText(String text, String targetLang) {
                Map<String, String> request = Map.of(
                                "text", text,
                                "target_lang", targetLang);

                @SuppressWarnings("unchecked")
                Map<String, Object> response = restClient.post()
                                .uri("/translate")
                                .contentType(MediaType.APPLICATION_JSON)
                                .body(request)
                                .retrieve()
                                .body(Map.class);

                if (response == null) {
                        throw new RuntimeException("Translation Service returned null response");
                }
                return (String) response.get("translated_text");
        }

        public String generateSpeech(String text, String lang) {
                Map<String, String> request = Map.of(
                                "text", text,
                                "lang", lang);

                @SuppressWarnings("unchecked")
                Map<String, Object> response = restClient.post()
                                .uri("/tts")
                                .contentType(MediaType.APPLICATION_JSON)
                                .body(request)
                                .retrieve()
                                .body(Map.class);

                if (response == null) {
                        throw new RuntimeException("TTS Service returned null response");
                }
                return (String) response.get("audio_data");
        }

        public String describeImage(MultipartFile file) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                MultipartBodyBuilder builder = new MultipartBodyBuilder();
                builder.part("file", file.getResource());

                HttpEntity<MultiValueMap<String, HttpEntity<?>>> requestEntity = new HttpEntity<>(builder.build(),
                                headers);

                try {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> response = restTemplate.postForObject(
                                        AI_SERVICE_URL + "/describe-image",
                                        requestEntity,
                                        Map.class);

                        if (response == null) {
                                throw new RuntimeException("Image Description Service returned null response");
                        }
                        return (String) response.get("description");
                } catch (Exception e) {
                        System.err.println("Image Description Service Error: " + e.getMessage());
                        throw new RuntimeException("Image Description Failed");
                }
        }
}
