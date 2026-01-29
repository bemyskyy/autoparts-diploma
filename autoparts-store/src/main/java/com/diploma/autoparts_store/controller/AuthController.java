package com.diploma.autoparts_store.controller;

import com.diploma.autoparts_store.dto.AuthRequest;
import com.diploma.autoparts_store.dto.AuthResponse;
import com.diploma.autoparts_store.dto.RegisterRequest;
import com.diploma.autoparts_store.dto.UserResponse;
import com.diploma.autoparts_store.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(Principal principal) {
        return ResponseEntity.ok(service.getProfile(principal.getName()));
    }
}
