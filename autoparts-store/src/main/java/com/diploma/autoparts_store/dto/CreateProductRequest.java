package com.diploma.autoparts_store.dto;

import java.math.BigDecimal;

public record CreateProductRequest(
        String sku,
        String name,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        String imageUrl,
        Long categoryId
) {}
