package com.gateway.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payments_order_id", columnList = "order_id"),
    @Index(name = "idx_payments_status", columnList = "status")
})
@Data
public class Payment {
    @Id
    private String id; // Format: pay_ + 16 chars

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "merchant_id", nullable = false)
    private UUID merchantId;

    private Integer amount;
    private String currency;
    private String method; // "upi" or "card"
    private String status; // "processing", "success", "failed"

    // UPI specific
    private String vpa;

    // Card specific
    @Column(name = "card_network")
    private String cardNetwork;

    @Column(name = "card_last4")
    private String cardLast4;

    @Column(name = "error_code")
    private String errorCode;

    @Column(name = "error_description")
    private String errorDescription;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
}