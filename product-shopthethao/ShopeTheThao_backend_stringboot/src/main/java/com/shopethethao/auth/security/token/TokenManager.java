package com.shopethethao.auth.security.token;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenManager {
    private final ConcurrentHashMap<String, String> tokenStore = new ConcurrentHashMap<>();

    public void saveToken(String username, String token, long expirationTime) {
        tokenStore.put(username, token);
    }

    public String getToken(String username) {
        return tokenStore.get(username);
    }

    public void removeToken(String username) {
        tokenStore.remove(username);
    }

    public void removeAllTokensForUser(String username) {
        tokenStore.remove(username);
    }
}
