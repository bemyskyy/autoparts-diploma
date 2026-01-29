package com.diploma.autoparts_store.service;

import com.diploma.autoparts_store.dto.AuthRequest;
import com.diploma.autoparts_store.dto.AuthResponse;
import com.diploma.autoparts_store.dto.RegisterRequest;
import com.diploma.autoparts_store.dto.UserResponse;
import com.diploma.autoparts_store.entity.Cart;
import com.diploma.autoparts_store.entity.Role;
import com.diploma.autoparts_store.entity.User;
import com.diploma.autoparts_store.repository.CartRepository;
import com.diploma.autoparts_store.repository.UserRepository;
import com.diploma.autoparts_store.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.CLIENT)
                .balance(BigDecimal.ZERO)
                .build();

        User savedUser = userRepository.save(user);

        var cart = Cart.builder()
                .user(savedUser)
                .build();
        cartRepository.save(cart);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());

        var jwtToken = jwtService.generateToken(extraClaims, user);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.phone(), request.password())
        );
        var user = userRepository.findByPhone(request.phone())
                .orElseThrow();

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());

        var jwtToken = jwtService.generateToken(extraClaims, user);
        return new AuthResponse(jwtToken);
    }

    public UserResponse getProfile(String phone) {
        var user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getPhone(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                user.getBalance()
        );
    }
}
