package com.gateway.services;

import com.gateway.models.Order;
import com.gateway.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
}