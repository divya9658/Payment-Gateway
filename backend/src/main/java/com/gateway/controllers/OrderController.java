package com.gateway.controllers;

import com.gateway.models.Order;
import com.gateway.services.OrderService;
import com.gateway.services.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ValidationService validationService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestHeader(value = "X-Api-Key", required = false) String apiKey,
            @RequestHeader(value = "X-Api-Secret", required = false) String apiSecret,
            @RequestBody Map<String, Object> payload) {
        
        // 1. Authentication Check
        if (!"key_test_abc123".equals(apiKey) || !"secret_test_xyz789".equals(apiSecret)) {
            return ResponseEntity.status(401).body(Map.of("error", 
                Map.of("code", "AUTHENTICATION_ERROR", "description", "Invalid API credentials")));
        }

        // 2. Amount Validation
        Object amountObj = payload.get("amount");
        if (!(amountObj instanceof Integer) || (Integer) amountObj < 100) {
            return ResponseEntity.status(400).body(Map.of("error", 
                Map.of("code", "BAD_REQUEST_ERROR", "description", "amount must be at least 100")));
        }

        // 3. Create and Save Order
        Order order = new Order();
        order.setId(validationService.generateId("order_")); 
        order.setMerchantId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
        order.setAmount((Integer) amountObj);
        order.setCurrency((String) payload.getOrDefault("currency", "INR"));
        order.setReceipt((String) payload.get("receipt"));
        
        @SuppressWarnings("unchecked")
        Map<String, Object> notes = (Map<String, Object>) payload.get("notes");
        order.setNotes(notes);
        
        order.setStatus("created");
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        Order savedOrder = orderService.saveOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @GetMapping("/{order_id}")
    public ResponseEntity<?> getOrder(
            @RequestHeader(value = "X-Api-Key", required = false) String apiKey,
            @RequestHeader(value = "X-Api-Secret", required = false) String apiSecret,
            @PathVariable("order_id") String orderId) {

        if (!"key_test_abc123".equals(apiKey) || !"secret_test_xyz789".equals(apiSecret)) {
            return ResponseEntity.status(401).body(Map.of("error", 
                Map.of("code", "AUTHENTICATION_ERROR", "description", "Invalid API credentials")));
        }

        Order order = orderService.getOrderById(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.status(404).body(Map.of("error", 
                Map.of("code", "NOT_FOUND_ERROR", "description", "Order not found")));
        }
    }
}