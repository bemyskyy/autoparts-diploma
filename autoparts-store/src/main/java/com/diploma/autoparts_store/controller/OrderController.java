package com.diploma.autoparts_store.controller;

import com.diploma.autoparts_store.dto.OrderDto;
import com.diploma.autoparts_store.entity.Role;
import com.diploma.autoparts_store.entity.User;
import com.diploma.autoparts_store.repository.UserRepository;
import com.diploma.autoparts_store.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    public OrderDto createOrder(Principal principal) {
        return orderService.createOrder(principal.getName());
    }

    @GetMapping
    public List<OrderDto> getMyOrders(Principal principal) {
        return orderService.getUserOrders(principal.getName());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<OrderDto> getAllOrdersForAdmin() {
        return orderService.getAllOrders();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void updateStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateStatus(id, status);
    }
}
