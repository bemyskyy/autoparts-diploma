package com.diploma.autoparts_store.dto;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String sku,
        String name,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        String imageUrl,
        String categoryName,
        Long categoryId
) {}
