package com.shopethethao.auth.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.auth.security.jwt.JwtUtils;
import com.shopethethao.auth.security.services.UserDetailsImpl;

import jakarta.servlet.http.HttpServletRequest;

@RequestMapping("/users")
@RestController
public class UserController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    TokenStore tokenStore;

    @GetMapping("/me")
    public ResponseEntity<?> authenticatedUser(HttpServletRequest request) {
        String token = jwtUtils.getJwtFromRequest(request);

        // Kiểm tra token có tồn tại trong request
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không được cung cấp");
        }

        // Kiểm tra token có hợp lệ về mặt cấu trúc và chữ ký
        if (!jwtUtils.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        // Kiểm tra token có tồn tại và chưa hết hạn trong TokenStore
        if (!tokenStore.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token đã hết hạn hoặc không được phép sử dụng");
        }

        // Lấy thông tin xác thực từ SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng không được xác thực");
        }

        // Lấy thông tin người dùng từ đối tượng xác thực
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(userDetails);
    }

}
