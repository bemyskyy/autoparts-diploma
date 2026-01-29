package com.diploma.autoparts_store.dto;

import java.math.BigDecimal;

public record UserResponse(
        Long id,
        String phone,
        String firstName,
        String lastName,
        String role,
        BigDecimal balance
) {}
