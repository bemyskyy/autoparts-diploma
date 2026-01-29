package com.diploma.autoparts_store.controller;

import com.diploma.autoparts_store.dto.CreateProductRequest;
import com.diploma.autoparts_store.dto.ProductDto;
import com.diploma.autoparts_store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<ProductDto> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String query
    ) {
        return productService.getProducts(categoryId, query);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ProductDto create(@RequestBody CreateProductRequest request) {
        return productService.createProduct(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ProductDto update(@PathVariable Long id, @RequestBody CreateProductRequest request) {
        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}
