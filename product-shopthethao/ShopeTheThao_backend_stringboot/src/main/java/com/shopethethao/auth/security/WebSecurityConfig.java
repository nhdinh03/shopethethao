package com.shopethethao.auth.security;

import java.util.Arrays;

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
import com.shopethethao.auth.security.oauth2.CustomOAuth2UserService;
import com.shopethethao.auth.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.shopethethao.auth.security.user.service.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    private final OAuth2AuthenticationSuccessHandler OAuth2AuthenticationSuccessHandler;

    private final CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    WebSecurityConfig(CustomOAuth2UserService customOAuth2UserService, OAuth2AuthenticationSuccessHandler OAuth2AuthenticationSuccessHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.OAuth2AuthenticationSuccessHandler = OAuth2AuthenticationSuccessHandler;
    }

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
                            "/api/stockReceipts/**", "/api/suppliers/**", "/api/userhistory-sse/**","/",
                            "/api/verifications/**", "/oauth2/**", "/login/oauth2/code/**").permitAll();

                    auth.requestMatchers("/test/test/**").permitAll();
                    auth.anyRequest().authenticated();
                }).oauth2Login(oauth2 -> oauth2
                    .loginPage("/oauth2/authorization/google") // Default login page for Google OAuth2
                    .defaultSuccessUrl("http://localhost:3000/", true) // Redirect after successful login
                    .failureUrl("/login?error=true") // Redirect after failed login
                    .userInfoEndpoint(userInfo -> userInfo
                        .userService(customOAuth2UserService))
                    .successHandler(OAuth2AuthenticationSuccessHandler)
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow origins
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://192.168.1.21:3000",
            "http://[2405:4802:a6b3:ea10:d2b9:7439:11d9:759c]:3000",
            "http://[2405:4802:a6b3:ea10:59fc:e9fc:cb77:5159]:3000",
            "capacitor://localhost",
            "ionic://localhost"
        ));
        
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
    
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
