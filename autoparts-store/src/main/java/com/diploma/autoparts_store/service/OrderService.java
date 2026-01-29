package com.diploma.autoparts_store.service;

import com.diploma.autoparts_store.dto.CartItemDto;
import com.diploma.autoparts_store.dto.OrderDto;
import com.diploma.autoparts_store.entity.*;
import com.diploma.autoparts_store.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDto createOrder(String userPhone) {
        User user = userRepository.findByPhone(userPhone)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Корзина не найдена"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Корзина пуста! Нельзя оформить заказ.");
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CREATED)
                .contactPhone(user.getPhone())
                .build();

        List<OrderItem> orderItems = new java.util.ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Товара " + product.getName() + " недостаточно на складе. Доступно: " + product.getStockQuantity());
            }

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();

            orderItems.add(orderItem);

            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalAmount);

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(String userPhone) {
        User user = userRepository.findByPhone(userPhone).orElseThrow();
        return orderRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateStatus(Long orderId, String statusName) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(statusName.toUpperCase());
            order.setStatus(newStatus);
            orderRepository.save(order);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Неверный статус заказа");
        }
    }

    private OrderDto mapToDto(Order order) {
        List<CartItemDto> itemsDto = order.getItems().stream()
                .map(item -> new CartItemDto(
                        item.getId(),
                        item.getProduct() != null ? item.getProduct().getId() : null,
                        item.getProduct() != null ? item.getProduct().getSku() : "DELETED",
                        item.getProduct() != null ? item.getProduct().getName() : "Товар удален",
                        item.getProduct() != null ? item.getProduct().getImageUrl() : null,
                        item.getQuantity(),
                        item.getPriceAtPurchase(),
                        item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .collect(Collectors.toList());

        return new OrderDto(
                order.getId(),
                order.getStatus().name(),
                order.getTotalPrice(),
                order.getCreatedAt(),
                itemsDto,
                order.getContactPhone()
        );
    }
}
