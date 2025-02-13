package com.shopethethao.auth.payload.response;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class TokenStore {

    private final Map<String, String> tokenMap = new HashMap<>(); // userId -> token
    private final Map<String, Date> expiryMap = new HashMap<>(); // token -> expiryDate

    // Lưu token mới với thời gian hết hạn cung cấp
    public void saveNewToken(String userId, String token, Date expiryDate) {
        // Loại bỏ token cũ của userId (nếu có)
        tokenMap.values().removeIf(existingToken -> userId.equals(getUserIdFromToken(existingToken)));
        expiryMap.put(token, expiryDate);
        tokenMap.put(userId, token);
    }

    // Lưu token mới với thời gian hết hạn mặc định (60 giây)
    public void saveNewToken(String userId, String token) {
        Date expiryDate = new Date(System.currentTimeMillis() + 60 * 100000); 
        saveNewToken(userId, token, expiryDate);
    }

    // Xác định token có hợp lệ hay không
    public boolean isTokenValid(String token) {
        Date expiryDate = expiryMap.get(token);
        if (expiryDate == null || expiryDate.before(new Date())) {
            return false; // Token không tồn tại hoặc đã hết hạn
        }
        return true;
    }

    // Tìm userId từ token
    public String getUserIdFromToken(String token) {
        return tokenMap.entrySet().stream()
                .filter(entry -> token.equals(entry.getValue()))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);
    }
}
