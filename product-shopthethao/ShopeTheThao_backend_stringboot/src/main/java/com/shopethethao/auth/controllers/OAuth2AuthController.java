package com.shopethethao.auth.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.shopethethao.auth.security.jwt.util.JwtUtils;
import com.shopethethao.auth.security.token.RefreshTokenService;
import com.shopethethao.modules.refreshToken.RefreshToken;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private AccountDAO accountDAO;

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2Auth = (OAuth2AuthenticationToken) authentication;
            OAuth2User oauth2User = oauth2Auth.getPrincipal();
            
            Map<String, Object> response = new HashMap<>();
            response.put("name", oauth2User.getAttribute("name"));
            response.put("email", oauth2User.getAttribute("email"));
            response.put("id", oauth2User.getName());
            
            // Generate token for API usage
            String token = jwtUtils.generateJwtToken(authentication);
            response.put("token", token);
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.ok("Not an OAuth2 user");
    }
}
