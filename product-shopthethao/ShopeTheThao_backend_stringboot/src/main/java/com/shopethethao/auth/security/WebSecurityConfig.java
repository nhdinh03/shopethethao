package com.shopethethao.auth.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.shopethethao.auth.security.jwt.filter.AuthTokenFilter;
import com.shopethethao.auth.security.jwt.handler.AuthEntryPointJwt;
import com.shopethethao.auth.security.user.service.UserDetailsServiceImpl;


@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ Bật CORS đúng cách
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/**", "/api/accounts/**", "/api/auth/**", "/api/auth/regenerate-otp/**",
                            "/users/me/**", "/api/upload/**",
                            "/api/productimages/**", "/api/lockreasons/**", "/api/cancelreason/**",
                            "/api/accountRole/**", "/api/accountStaff/**", "/api/brands/**", "/api/cancel-reason/**",
                            "/api/categories/**", "/api/comment/**", "/api/detailedInvoices/**", "/api/invoice/**",
                            "/api/productattributemappings/**", "/api/productattributes/**", "/api/products/**",
                            "/api/productsizes/**", "/api/receiptproduct/**", "/api/role/**", "/api/size/**",
                            "/api/stockReceipts/**", "/api/suppliers/**", "/api/userhistory-sse/**",
                            "/api/verifications/**").permitAll();

                    auth.requestMatchers("/test/test/**").permitAll();
                    auth.anyRequest().authenticated();
                });

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow more origins, including development and production URLs
        config.setAllowedOrigins(List.of(
            "http://localhost:3000", 
            "http://localhost:8080",
            "http://127.0.0.1:3000", 
            "http://127.0.0.1:5173",
            "http://localhost:5173"
            // Add your production domain when needed
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of(
            "Content-Type", 
            "X-Requested-With", 
            "accept", 
            "Origin", 
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers", 
            "Last-Event-ID",
            "Authorization"
        ));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // Cache preflight request for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
