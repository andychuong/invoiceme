package com.invoiceme.infrastructure.api.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/util")
public class PasswordHashController {
    private final PasswordEncoder passwordEncoder;

    public PasswordHashController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/hash")
    public String generateHash(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        boolean matches = passwordEncoder.matches(password, hash);
        return "Password: " + password + "\nHash: " + hash + "\nVerifies: " + matches;
    }
}

