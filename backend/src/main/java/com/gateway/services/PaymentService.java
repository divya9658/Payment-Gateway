package com.gateway.services;

import com.gateway.models.Payment;
import com.gateway.models.Order;
import com.gateway.repositories.PaymentRepository;
import com.gateway.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.Instant;
import java.util.Random;
import java.util.Optional;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private final Random random = new Random();

    @Value("${TEST_MODE:false}")
    private boolean testMode;

    @Value("${TEST_PAYMENT_SUCCESS:true}")
    private boolean testPaymentSuccess;

    @Value("${TEST_PROCESSING_DELAY:1000}")
    private int testProcessingDelay;

    // Fix for Dashboard: Returns all payments from DB
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public boolean acquirePaymentLock(String orderId) {
        String key = "lock:payment:" + orderId;
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(key, "locked", Duration.ofMinutes(10));
        return acquired != null && acquired;
    }

    public Payment createInitialPayment(Payment payment) {
        payment.setStatus("processing");
        payment.setCreatedAt(Instant.now());
        payment.setUpdatedAt(Instant.now());
        return paymentRepository.save(payment);
    }

    @Async
    public void processPaymentAsync(String paymentId, String method) {
        try {
            int delay = testMode ? testProcessingDelay : (5000 + random.nextInt(5001));
            Thread.sleep(delay);

            Payment payment = paymentRepository.findById(paymentId).orElseThrow();
            
            boolean isSuccess;
            if (testMode) {
                isSuccess = testPaymentSuccess;
            } else {
                double threshold = "upi".equalsIgnoreCase(method) ? 0.90 : 0.95;
                isSuccess = random.nextDouble() < threshold;
            }

            if (isSuccess) {
                payment.setStatus("success");
                updateOrderStatus(payment.getOrderId(), "paid");
            } else {
                payment.setStatus("failed");
                payment.setErrorCode("PAYMENT_FAILED");
                payment.setErrorDescription("Bank declined the transaction");
            }

            payment.setUpdatedAt(Instant.now());
            // FIXED: Removed the incorrect payment.savePayment line
            paymentRepository.save(payment);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void updateOrderStatus(String orderId, String status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setStatus(status);
            orderRepository.save(order);
        });
    }

    public Optional<Payment> getPaymentById(String id) {
        return paymentRepository.findById(id);
    }
}