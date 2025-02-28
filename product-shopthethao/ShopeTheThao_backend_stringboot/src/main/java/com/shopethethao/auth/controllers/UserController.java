package com.shopethethao.auth.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.auth.security.jwt.util.JwtUtils;
import com.shopethethao.auth.security.token.TokenStore;
import com.shopethethao.auth.security.user.entity.UserDetailsImpl;
import com.shopethethao.auth.payload.response.MessageResponse;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RequestMapping("/users")
@RestController
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    TokenStore tokenStore;

    @GetMapping("/me")
    public ResponseEntity<?> authenticatedUser(HttpServletRequest request) {
        try {
            String token = jwtUtils.getJwtFromRequest(request);

            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Token không được cung cấp"));
            }

            if (!jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Token không hợp lệ"));
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Người dùng không được xác thực"));
            }

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return ResponseEntity.ok(userDetails);
            
        } catch (Exception e) {
            logger.error("Error in /me endpoint: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Lỗi server: " + e.getMessage()));
        }
    }

}
