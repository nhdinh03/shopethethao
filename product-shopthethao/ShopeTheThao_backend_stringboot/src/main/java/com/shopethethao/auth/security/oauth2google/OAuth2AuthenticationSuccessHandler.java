package com.shopethethao.auth.security.oauth2google;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;
import java.util.Date;
import java.util.Set;
import java.util.HashSet;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.shopethethao.auth.security.jwt.util.JwtUtils;
import com.shopethethao.auth.security.token.RefreshTokenService;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.modules.refreshToken.RefreshToken;
import com.shopethethao.modules.role.Role;
import com.shopethethao.modules.role.RoleDAO;
import com.shopethethao.modules.role.ERole;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private AccountDAO accountDAO;
    
    @Autowired
    private RoleDAO roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        
        try {
            String targetUrl = determineTargetUrl(request, response, authentication);

            if (response.isCommitted()) {
                logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
                return;
            }

            clearAuthenticationAttributes(request);
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } catch (Exception e) {
            logger.error("OAuth2 authentication error", e);
            // Fall back to home page on error
            getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/login?error=authentication_error");
        }
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String targetUrl = "http://localhost:3000/oauth2/redirect";
        
        try {
            final String userId = extractUserId(authentication);
            final String email;
            final String name;
            
            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                Map<String, Object> attributes = oauth2User.getAttributes();
                email = (String) attributes.get("email");
                name = (String) attributes.get("name");
                logger.info("OAuth2 user details: email={}, name={}", email, name);
            } else {
                email = null;
                name = null;
            }
            
            final String token = jwtUtils.generateJwtToken(authentication);
            
            try {
                // Using effectively final variables in the lambda
                Account account = accountDAO.findByEmailWithRoles(email)
                    .orElseGet(() -> {
                        try {
                            return createOAuth2UserAccount(userId, email, name);
                        } catch (Exception e) {
                            logger.error("Failed to create account: {}", e.getMessage());
                            throw new RuntimeException("Failed to create new account", e);
                        }
                    });
                
                logger.info("Using account ID: {}", account.getId());
                
                // Create refresh token
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(account.getId());
                
                // Extract roles safely - account already has initialized roles from the fetch join
                List<String> roles = new ArrayList<>();
                if (account.getRoles() != null) {
                    roles = account.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList());
                }
                
                String encodedName = java.net.URLEncoder.encode(account.getFullname(), "UTF-8");
                
                // Build redirect URL
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("token", token)
                        .queryParam("refreshToken", refreshToken != null ? refreshToken.getToken() : "")
                        .queryParam("userId", account.getId())
                        .queryParam("email", account.getEmail())
                        .queryParam("name", encodedName)
                        .queryParam("roles", String.join(",", roles))
                        .build(false)
                        .toUriString();
                        
            } catch (Exception e) {
                logger.error("Error during OAuth2 authentication: {}", e.getMessage(), e);
                
                // Fallback URL with minimal info if error occurs - using the final variables
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("token", token)
                        .queryParam("userId", userId)
                        .queryParam("email", email)
                        .build().toUriString();
            }
        } catch (Exception e) {
            logger.error("Error building redirect URL", e);
            return UriComponentsBuilder.fromUriString(targetUrl)
                    .queryParam("error", "authentication_failed")
                    .build().toUriString();
        }
    }
    
    private String extractUserId(Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oauth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            
            if (oauth2User instanceof OAuth2UserPrincipal) {
                return ((OAuth2UserPrincipal) oauth2User).getName();
            }
            
            // If it's a standard OAuth2User, try to extract ID from the provider
            String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
            
            if ("google".equals(registrationId)) {
                // Google provides 'sub' as the unique identifier
                String providerId = (String) oauth2User.getAttributes().get("sub");
                return "google_" + providerId;
            }
            
            // Default to using the name from the authentication
            return authentication.getName();
        }
        
        return authentication.getName();
    }
    
    // Helper method to create an OAuth2 user account
    private Account createOAuth2UserAccount(String userId, String email, String name) {
        Account account = new Account();
        account.setId(userId);
        account.setEmail(email);
        account.setFullname(name);
        account.setStatus(1);
        account.setVerified(true);
        account.setCreatedDate(new Date());
        
        // Generate random phone number
        String randomPhone = "OA" + Math.abs(UUID.randomUUID().getMostSignificantBits() % 10000000000L);
        account.setPhone(randomPhone);
        
        // Set random password
        account.setPassword(new BCryptPasswordEncoder().encode(UUID.randomUUID().toString()));
        
        // Set USER role
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.USER)
                .orElseThrow(() -> new RuntimeException("Error: Role USER not found"));
        roles.add(userRole);
        account.setRoles(roles);
        
        return accountDAO.save(account);
    }
}