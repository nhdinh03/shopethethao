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
        logger.info("Khởi tạo JwtUtils và kiểm tra khóa bí mật");
        validateSecretKey(jwtSecret);
    }

    // Tạo JWT
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        logger.info("Đang tạo JWT cho người dùng: {}", userPrincipal.getUsername());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        logger.debug("Chi tiết tạo token - Thời gian tạo: {}, Hết hạn: {}, Thời gian tồn tại: {} ms",
                now, expiryDate, jwtExpirationMs);

        String token = Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();

        logger.info("JWT đã được tạo thành công cho người dùng: {}", userPrincipal.getUsername());
        logger.debug("Độ dài token: {} ký tự", token.length());

        tokenManager.saveToken(userPrincipal.getUsername(), token, System.currentTimeMillis() + jwtExpirationMs);

        return token;
    }

    // Mã hóa
    private Key key() {
        try {
            logger.debug("Đang tạo khóa từ JWT secret");
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            logger.debug("Độ dài khóa (byte): {}", keyBytes.length);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            logger.error("Không thể tạo khóa từ JWT secret: {}", e.getMessage());
            throw new SecurityException("Tạo khóa thất bại", e);
        }
    }

    private void validateSecretKey(String secret) {
        if (secret == null || secret.length() < 32) {
            logger.error("Khóa bí mật JWT không đủ độ dài (tối thiểu 256 bits / 32 bytes)");
            throw new SecurityException("Khóa bí mật JWT không đảm bảo an toàn");
        }

        try {
            Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException e) {
            logger.error("Khóa bí mật JWT không phải định dạng Base64 hợp lệ");
            throw new SecurityException("Khóa bí mật JWT không hợp lệ", e);
        }
    }

    // Giải mã username từ JWT
    public String getUserNameFromJwtToken(String token) {
        logger.debug("Đang trích xuất tên người dùng từ JWT");
        try {
            String username = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            logger.debug("Tên người dùng đã trích xuất thành công: {}", username);
            return username;
        } catch (Exception e) {
            logger.error("Lỗi khi trích xuất tên người dùng từ token: {}", e.getMessage());
            throw e;
        }
    }

    // Xác thực token
    public boolean validateJwtToken(String authToken) {
        try {
            logger.debug("Bắt đầu kiểm tra tính hợp lệ của JWT");

            var parser = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .setAllowedClockSkewSeconds(clockSkewSeconds)
                    .build();

            var claims = parser.parseClaimsJws(authToken);
            String userId = claims.getBody().getSubject();

            logger.debug("Token hợp lệ cho người dùng: {}", userId);

            String storedToken = tokenManager.getToken(userId);
            if (storedToken == null || !storedToken.equals(authToken)) {
                logger.warn("Xác thực token thất bại - Token không khớp với dữ liệu lưu trữ cho người dùng: {}",
                        userId);
                return false;
            }

            Date expiration = claims.getBody().getExpiration();
            Date now = new Date();
            long skewMillis = clockSkewSeconds * 300000;

            logger.debug("Kiểm tra thời gian hết hạn token - Hiện tại: {}, Hết hạn: {}, Sai số: {} ms",
                    now, expiration, skewMillis);

            if (expiration.before(new Date(now.getTime() - skewMillis))) {
                logger.warn("Token đã hết hạn cho người dùng: {}. Hết hạn vào: {}", userId, expiration);
                tokenManager.removeToken(userId);
                return false;
            }

            logger.info("Token hợp lệ cho người dùng: {}. Thời gian còn lại: {} ms",
                    userId, (expiration.getTime() - now.getTime()));
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
            logger.error("Lỗi xác thực JWT: {}", e.getMessage());
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
        logger.info("Invalidating token for user: {}", userId);
        tokenManager.removeToken(userId);
        logger.debug("Token invalidated successfully for user: {}", userId);
    }

    // set dữ liệu cho token
    public String generateTokenFromUsername(String username) {
        logger.info("Generating new token from username: {}", username);
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
        logger.debug("Token generated successfully for username: {}", username);
        return token;
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
