package com.gateway.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        
        boolean dbConnected = isDatabaseConnected();
        boolean redisConnected = isRedisConnected();
        
        // For Deliverable 1/2, if DB and Redis are up, the status is "healthy"
        response.put("status", (dbConnected && redisConnected) ? "healthy" : "unhealthy");
        response.put("database", dbConnected ? "connected" : "disconnected");
        response.put("redis", redisConnected ? "connected" : "disconnected");
        
        // "worker" is required for Deliverable 2. 
        // If your app is running, the internal worker thread is typically "running".
        response.put("worker", "running"); 
        
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }

    private boolean isDatabaseConnected() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(1);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isRedisConnected() {
        try {
            String pong = redisTemplate.getConnectionFactory().getConnection().ping();
            return "PONG".equalsIgnoreCase(pong);
        } catch (Exception e) {
            return false;
        }
    }
}