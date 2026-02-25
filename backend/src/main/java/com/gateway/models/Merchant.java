package com.gateway.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.Instant;

@Entity
@Table(name = "merchants")
@Data
public class Merchant {
    @Id
    private UUID id;
    private String name;
    private String email;
    private String apiKey;
    private String apiSecret;
    private String webhookUrl;
    
    @Column(name = "is_active")
    private boolean isActive = true; 

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    // Explicitly adding this to fix the compilation error
    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
}