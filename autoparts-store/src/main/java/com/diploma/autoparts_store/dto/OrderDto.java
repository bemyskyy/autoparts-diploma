package com.diploma.autoparts_store.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
        Long id,
        String status,
        BigDecimal totalPrice,
        LocalDateTime createdAt,
        List<CartItemDto> items,
        String contactPhone
) {}
