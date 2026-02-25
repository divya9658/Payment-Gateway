package com.gateway.config;

import com.gateway.models.Merchant;
import com.gateway.repositories.MerchantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired 
    private MerchantRepository merchantRepository;

    @Override
    public void run(String... args) {
        // Check if test merchant exists by email to handle duplicates gracefully
        if (!merchantRepository.existsByEmail("test@example.com")) {
            Merchant m = new Merchant();
            // Use the EXACT UUID from requirements
            m.setId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
            m.setName("Test Merchant");
            m.setEmail("test@example.com");
            m.setApiKey("key_test_abc123");
            m.setApiSecret("secret_test_xyz789");
            m.setIsActive(true);
            merchantRepository.save(m);
            System.out.println("✅ Test merchant seeded successfully.");
        } else {
            System.out.println("ℹ️ Test merchant already exists, skipping seeding.");
        }
    }
}