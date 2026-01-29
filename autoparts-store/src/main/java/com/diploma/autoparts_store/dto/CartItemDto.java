package com.diploma.autoparts_store.dto;

import java.math.BigDecimal;

public record CartItemDto(
        Long id,
        Long productId,
        String sku,
        String name,
        String imageUrl,
        Integer quantity,
        BigDecimal price,
        BigDecimal sum
) {}
