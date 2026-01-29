package com.diploma.autoparts_store.dto;

import java.util.List;

public record CategoryDto(
        Long id,
        String name,
        Long parentId,
        List<CategoryDto> children
) {}
