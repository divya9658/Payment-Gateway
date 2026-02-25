package com.gateway.controllers;

import com.gateway.services.ValidationService;
import com.gateway.models.Payment;
import com.gateway.models.Order;
import com.gateway.services.PaymentService;
import com.gateway.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(
    originPatterns = "*", 
    allowCredentials = "true", 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}
)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ValidationService validationService;

    private final String EXPECTED_KEY = "key_test_abc123";
    private final String EXPECTED_SECRET = "secret_test_xyz789";

    @GetMapping
    public ResponseEntity<?> getAllPayments(
            @RequestHeader(value = "X-Api-Key", required = false) String apiKey,
            @RequestHeader(value = "X-Api-Secret", required = false) String apiSecret) {
        
        if (!EXPECTED_KEY.equals(apiKey) || !EXPECTED_SECRET.equals(apiSecret)) {
            return ResponseEntity.status(401).body(Map.of("error", 
                Map.of("code", "AUTHENTICATION_ERROR", "description", "Invalid API credentials")));
        }
        
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PostMapping
    public ResponseEntity<?> processPayment(
            @RequestHeader(value = "X-Api-Key", required = false) String apiKey,
            @RequestHeader(value = "X-Api-Secret", required = false) String apiSecret,
            @RequestBody Map<String, Object> payload) {
        
        String orderId = (String) payload.get("order_id");
        Order order = orderService.getOrderById(orderId);

        if (order == null) {
            return ResponseEntity.status(404).body(Map.of("error", 
                Map.of("code", "NOT_FOUND_ERROR", "description", "Order not found")));
        }

        boolean hasAuth = EXPECTED_KEY.equals(apiKey) && EXPECTED_SECRET.equals(apiSecret);
        if (!hasAuth && (apiKey != null || apiSecret != null)) {
             return ResponseEntity.status(401).body(Map.of("error", 
                Map.of("code", "AUTHENTICATION_ERROR", "description", "Invalid API credentials")));
        }

        if (!paymentService.acquirePaymentLock(orderId)) {
            return ResponseEntity.status(400).body(Map.of("error", 
                Map.of("code", "BAD_REQUEST_ERROR", "description", "Payment already in progress")));
        }

        Payment payment = new Payment();
        payment.setId(validationService.generateId("pay_"));
        payment.setOrderId(orderId);
        payment.setMethod((String) payload.get("method"));
        payment.setAmount(order.getAmount());
        payment.setCurrency(order.getCurrency());
        payment.setMerchantId(order.getMerchantId());

        if ("upi".equalsIgnoreCase(payment.getMethod())) {
            String vpa = (String) payload.get("vpa");
            if (!validationService.validateVPA(vpa)) {
                return ResponseEntity.status(400).body(Map.of("error", 
                    Map.of("code", "BAD_REQUEST_ERROR", "description", "Invalid VPA format")));
            }
            payment.setVpa(vpa);
        } 
        else if ("card".equalsIgnoreCase(payment.getMethod())) {
            Map<String, Object> cardData = (Map<String, Object>) payload.get("card");
            String cardNumber = (String) cardData.get("number");
            
            if (!validationService.validateLuhn(cardNumber)) {
                return ResponseEntity.status(400).body(Map.of("error", 
                    Map.of("code", "INVALID_CARD", "description", "Card validation failed")));
            }

            payment.setCardNetwork(validationService.detectNetwork(cardNumber));
            payment.setCardLast4(cardNumber.substring(cardNumber.length() - 4));
        }

        Payment savedPayment = paymentService.createInitialPayment(payment);
        paymentService.processPaymentAsync(savedPayment.getId(), payment.getMethod());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPayment);
    }

    /**
     * FIXED: Explicit type casting for the Optional map to prevent 
     * compilation errors regarding incompatible bounds.
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPayment(@PathVariable String paymentId) {
        return paymentService.getPaymentById(paymentId)
                .<ResponseEntity<?>>map(payment -> ResponseEntity.ok(payment))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", 
                    Map.of("code", "NOT_FOUND_ERROR", "description", "Payment not found"))));
    }
}