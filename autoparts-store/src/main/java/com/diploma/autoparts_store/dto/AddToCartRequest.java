package com.diploma.autoparts_store.dto;

public record AddToCartRequest(
        Long productId,
        Integer quantity
) {}
