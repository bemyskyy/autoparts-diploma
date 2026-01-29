package com.diploma.autoparts_store.controller;

import com.diploma.autoparts_store.dto.AddToCartRequest;
import com.diploma.autoparts_store.dto.CartDto;
import com.diploma.autoparts_store.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public CartDto getCart(Principal principal) {
        return cartService.getCart(principal.getName());
    }

    @PostMapping("/items")
    public CartDto addToCart(Principal principal, @RequestBody AddToCartRequest request) {
        return cartService.addToCart(principal.getName(), request);
    }

    @DeleteMapping("/items/{itemId}")
    public CartDto removeItem(Principal principal, @PathVariable Long itemId) {
        return cartService.removeFromCart(principal.getName(), itemId);
    }

    @DeleteMapping
    public void clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
    }
}
