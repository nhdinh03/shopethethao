package com.shopethethao.auth.security.jwt.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopethethao.auth.security.jwt.util.JwtUtils;
import com.shopethethao.auth.security.user.service.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthTokenFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUtils jwtUtils;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  private com.shopethethao.auth.security.token.TokenManager tokenManager;

  private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      // Skip authentication for preflight requests
      if (request.getMethod().equals("OPTIONS")) {
        filterChain.doFilter(request, response);
        return;
      }

      String jwt = parseJwt(request);
      if (jwt != null) {
        Map<String, Object> tokenValidation = jwtUtils.validateJwtTokenWithDetails(jwt);
        boolean isValid = (boolean) tokenValidation.get("valid");
        
        if (isValid) {
          String username = jwtUtils.getUserNameFromJwtToken(jwt);
          UserDetails userDetails = userDetailsService.loadUserByUsername(username);

          UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
              userDetails, null, userDetails.getAuthorities());
          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
          // Check if it's an API request or other request that needs redirection
          if (request.getServletPath().startsWith("/api/")) {
            boolean requireLogin = (boolean) tokenValidation.getOrDefault("requireLogin", false);
            String message = (String) tokenValidation.getOrDefault("message", "Token không hợp lệ hoặc đã hết hạn");
            
            if (requireLogin) {
              sendAuthErrorResponse(response, message, "TOKEN_EXPIRED", true);
            } else {
              sendAuthErrorResponse(response, message, "TOKEN_INVALID", false);
            }
            return;
          }
        }
      }
      filterChain.doFilter(request, response);
    } catch (Exception e) {
      logger.error("Cannot set user authentication: {}", e.getMessage());
      filterChain.doFilter(request, response);
    }
  }

  private void sendAuthErrorResponse(HttpServletResponse response, String message, String code, boolean requireLogin) throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    Map<String, Object> errorResponse = new HashMap<>();
    errorResponse.put("success", false);
    errorResponse.put("status", "UNAUTHORIZED");
    errorResponse.put("message", message);
    errorResponse.put("code", code);
    errorResponse.put("requireLogin", requireLogin);
    errorResponse.put("timestamp", System.currentTimeMillis());

    new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
  }

  private String parseJwt(HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");

    if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
      return headerAuth.substring(7);
    }

    return null;
  }
}
