package com.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main Entry Point for the Payment Gateway.
 * @EnableAsync is required to process the 5-10s simulated bank delay
 * without blocking the main request thread.
 */
@SpringBootApplication
@EnableAsync
public class PaymentGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentGatewayApplication.class, args);
    }
}