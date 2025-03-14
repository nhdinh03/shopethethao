package com.shopethethao.auth.security.token;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Component
public class TokenManager {
    private static final Logger logger = LoggerFactory.getLogger(TokenManager.class);
    private final ConcurrentHashMap<String, TokenInfo> tokenStore = new ConcurrentHashMap<>();
    private static final String TOKEN_STORAGE_FILE = "token_store.dat";
    
    @PostConstruct
    @SuppressWarnings("unchecked")
    public void init() {
        try {
            File file = new File(TOKEN_STORAGE_FILE);
            if (file.exists()) {
                try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
                    Map<String, TokenInfo> loadedTokens = (Map<String, TokenInfo>) ois.readObject();
                    // Clean expired tokens during load
                    long now = System.currentTimeMillis();
                    loadedTokens.entrySet().removeIf(entry -> entry.getValue().expirationTime < now);
                    tokenStore.putAll(loadedTokens);
                    logger.info("Loaded {} valid tokens from persistent storage", tokenStore.size());
                }
            }
        } catch (Exception e) {
            logger.error("Failed to load tokens from persistent storage", e);
        }
    }
    
    @PreDestroy
    public void shutdown() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(TOKEN_STORAGE_FILE))) {
            oos.writeObject(new HashMap<>(tokenStore));
            logger.info("Saved {} tokens to persistent storage", tokenStore.size());
        } catch (Exception e) {
            logger.error("Failed to save tokens to persistent storage", e);
        }
    }

    public void saveToken(String username, String token, long expirationTime) {
        tokenStore.put(username, new TokenInfo(token, expirationTime));
        logger.debug("Token saved for user: {}, expires at: {}", username, expirationTime);
    }

    public String getToken(String username) {
        TokenInfo info = tokenStore.get(username);
        if (info == null) {
            return null;
        }
        
        if (System.currentTimeMillis() > info.expirationTime) {
            tokenStore.remove(username);
            logger.debug("Removed expired token for user: {}", username);
            return null;
        }
        return info.token;
    }

    public void removeToken(String username) {
        tokenStore.remove(username);
        logger.debug("Token removed for user: {}", username);
    }

    public void removeAllTokensForUser(String username) {
        tokenStore.remove(username);
        logger.debug("All tokens removed for user: {}", username);
    }
    
    public static class TokenInfo implements Serializable {
        private static final long serialVersionUID = 1L;
        public final String token;
        public final long expirationTime;
        
        public TokenInfo(String token, long expirationTime) {
            this.token = token;
            this.expirationTime = expirationTime;
        }
    }
}
