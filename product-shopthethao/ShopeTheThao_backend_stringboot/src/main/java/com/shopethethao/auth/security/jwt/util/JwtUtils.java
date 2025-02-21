package com.shopethethao.auth.security.jwt.util;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.shopethethao.auth.security.token.TokenManager;
import com.shopethethao.auth.security.user.entity.UserDetailsImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import io.jsonwebtoken.security.SecurityException;

import jakarta.annotation.PostConstruct;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${bezkoder.app.jwtSecret}")
    private String jwtSecret;

    @Value("${bezkoder.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${bezkoder.app.jwtClockSkew:60}")
    private long clockSkewSeconds;

    @Autowired
    private TokenManager tokenManager;

    @PostConstruct
    public void init() {
        logger.info("Initializing JwtUtils and validating secret key");
        validateSecretKey(jwtSecret);
    }

    // Tạo JWT
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        
        // Log để debug
        logger.info("Token created at: " + now);
        logger.info("Token will expire at: " + expiryDate);
        logger.info("JWT Expiration time (ms): " + jwtExpirationMs);

        String token = Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();

        tokenManager.saveToken(userPrincipal.getUsername(), token,
                System.currentTimeMillis() + jwtExpirationMs);

        return token;
    }

    // Mã hóa 
    private Key key() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            logger.debug("Decoded secret key length: {} bytes", keyBytes.length);
            
            Key key = Keys.hmacShaKeyFor(keyBytes);
            logger.debug("Generated key algorithm: {}", key.getAlgorithm());
            return key;
        } catch (Exception e) {
            logger.error("Error generating key: {}", e.getMessage());
            throw new SecurityException("Failed to generate key", e);
        }
    }

    private void validateSecretKey(String secret) {
        if (secret == null || secret.length() < 32) {
            logger.error("JWT secret key không đủ độ dài (tối thiểu 256 bits / 32 bytes)");
            throw new SecurityException("JWT secret key không đảm bảo độ an toàn");
        }

        try {
            // Kiểm tra xem secret có phải là Base64 hợp lệ không
            Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException e) {
            logger.error("JWT secret key không phải định dạng Base64 hợp lệ");
            throw new SecurityException("JWT secret key không hợp lệ", e);
        }
    }

    // Giải mã username từ JWT
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // Xác thực token
    public boolean validateJwtToken(String authToken) {
        try {
            logger.debug("Starting token validation");
            
            // Add clock skew to parser
            var parser = Jwts.parserBuilder()
                .setSigningKey(key())
                .setAllowedClockSkewSeconds(clockSkewSeconds) // Add clock skew
                .build();
                
            var claims = parser.parseClaimsJws(authToken);
            
            // Kiểm tra token có tồn tại trong store không
            String userId = claims.getBody().getSubject();
            String storedToken = tokenManager.getToken(userId);

            if (storedToken == null || !storedToken.equals(authToken)) {
                logger.warn("Token không tồn tại hoặc không khớp trong TokenManager");
                return false;
            }

            // Check expiration with clock skew consideration
            Date expiration = claims.getBody().getExpiration();
            Date now = new Date();
            long skewMillis = clockSkewSeconds * 1000;
            
            if (expiration.before(new Date(now.getTime() - skewMillis))) {
                logger.error("Token đã hết hạn tại: {}", expiration);
                tokenManager.removeToken(userId);
                return false;
            }
            
            logger.info("Token hợp lệ, còn {} ms tới khi hết hạn", 
                (expiration.getTime() - now.getTime()));
            return true;

        } catch (ExpiredJwtException e) {
            logger.error("JWT đã hết hạn: {}", e.getMessage());
            try {
                String userId = e.getClaims().getSubject();
                tokenManager.removeToken(userId);
            } catch (Exception ex) {
                logger.error("Lỗi khi xóa token hết hạn: {}", ex.getMessage());
            }
            return false;
        } catch (Exception e) {
            logger.error("JWT Validation Error: {}", e.getMessage());
            return false;
        }
    }

    // Lấy JWT từ request
    public String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // Lấy thời gian hết hạn của JWT
    public int getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    // Thêm phương thức để xóa token khi logout
    public void invalidateToken(String userId) {
        tokenManager.removeToken(userId);
    }

    //set dữ liệu cho token
    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Thêm phương thức để kiểm tra secret key
    public void debugSecretKey() {
        try {
            Key k = key();
            logger.info("Secret key algorithm: {}", k.getAlgorithm());
            logger.info("Secret key format: {}", k.getFormat());
            logger.info("Secret key length: {} bits", k.getEncoded().length * 8);
        } catch (Exception e) {
            logger.error("Error debugging secret key: {}", e.getMessage());
        }
    }
}
