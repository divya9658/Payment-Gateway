package com.gateway.repositories;

import com.gateway.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    
    // Required for Deliverable 2: Check if a successful payment already exists for an order
    boolean existsByOrderIdAndStatus(String orderId, String status);

    // Required for Dashboard: Fetch all payments for a specific merchant
    List<Payment> findByMerchantId(UUID merchantId);
    
    // Required for Dashboard Stats: Sum of successful payments
    List<Payment> findByMerchantIdAndStatus(UUID merchantId, String status);
}