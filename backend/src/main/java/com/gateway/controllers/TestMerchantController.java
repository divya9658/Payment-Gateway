package com.gateway.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class TestMerchantController {

    @GetMapping("/api/v1/test/merchant")
    public ResponseEntity<Map<String, Object>> getTestMerchant() {
        // Using LinkedHashMap to maintain property order for clean JSON
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", "550e8400-e29b-41d4-a716-446655440000");
        response.put("email", "test@example.com");
        response.put("api_key", "key_test_abc123");
        response.put("seeded", true);
        
        return ResponseEntity.ok(response);
    }
}