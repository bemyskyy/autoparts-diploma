package com.diploma.autoparts_store.service;

import com.diploma.autoparts_store.dto.AddToCartRequest;
import com.diploma.autoparts_store.dto.CartDto;
import com.diploma.autoparts_store.dto.CartItemDto;
import com.diploma.autoparts_store.entity.Cart;
import com.diploma.autoparts_store.entity.CartItem;
import com.diploma.autoparts_store.entity.Product;
import com.diploma.autoparts_store.entity.User;
import com.diploma.autoparts_store.repository.CartRepository;
import com.diploma.autoparts_store.repository.ProductRepository;
import com.diploma.autoparts_store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartDto getCart(String userPhone) {
        Cart cart = getCartEntity(userPhone);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto addToCart(String userPhone, AddToCartRequest request) {
        Cart cart = getCartEntity(userPhone);

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.quantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto removeFromCart(String userPhone, Long cartItemId) {
        Cart cart = getCartEntity(userPhone);

        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));

        cartRepository.save(cart);
        return mapToDto(cart);
    }

    @Transactional
    public void clearCart(String userPhone) {
        Cart cart = getCartEntity(userPhone);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getCartEntity(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        return cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Корзина пользователя не найдена" + phone));
    }

    private CartDto mapToDto(Cart cart) {
        BigDecimal totalPrice = BigDecimal.ZERO;

        var itemsDto = cart.getItems().stream().map(item -> {
            BigDecimal sum = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return new CartItemDto(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getSku(),
                    item.getProduct().getName(),
                    item.getProduct().getImageUrl(),
                    item.getQuantity(),
                    item.getProduct().getPrice(),
                    sum
            );
        }).collect(Collectors.toList());

        for (CartItemDto item : itemsDto) {
            totalPrice = totalPrice.add(item.sum());
        }

        return new CartDto(itemsDto, totalPrice);
    }
}