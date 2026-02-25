package com.gateway.repositories;

import com.gateway.models.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, UUID> {
    // Required by DataSeeder to avoid duplicate entries
    boolean existsByEmail(String email);
    
    // Required for API Authentication later
    java.util.Optional<Merchant> findByApiKey(String apiKey);
}