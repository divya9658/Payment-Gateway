package com.gateway.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_orders_merchant_id", columnList = "merchant_id")
})
@Data
public class Order {
    @Id
    private String id; // Generated manually as order_ + 16 chars

    @Column(name = "merchant_id", nullable = false)
    private UUID merchantId;

    @Column(nullable = false)
    private Integer amount;

    private String currency = "INR";

    private String receipt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> notes;

    @Column(length = 20)
    private String status = "created";

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }
}