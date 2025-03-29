package com.shopethethao.auth.security.token;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.modules.refreshToken.RefreshToken;
import com.shopethethao.modules.refreshToken.RefreshTokenRepository;

import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService {
    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenService.class);
    
    @Value("${bezkoder.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private AccountDAO dao;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(String userId) {
        Optional<Account> accountOpt = dao.findById(userId);
        if (!accountOpt.isPresent()) {
            logger.warn("Account not found for ID: {}", userId);
            return null;
        }
        
        try {
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setAccount(accountOpt.get());
            refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
            refreshToken.setToken(UUID.randomUUID().toString());
            return refreshTokenRepository.save(refreshToken);
        } catch (Exception e) {
            logger.error("Error creating refresh token: {}", e.getMessage());
            return null;
        }
    }

    // Add a new method that creates accounts if they don't exist
    public RefreshToken createRefreshTokenForOAuth2User(String userId, String email, String fullname) {
        RefreshToken refreshToken = new RefreshToken();
        
        // Try to find the account or create it if it doesn't exist
        refreshToken.setAccount(dao.findById(userId).orElseGet(() -> {
            // Create a new account for the OAuth2 user
            Account newAccount = new Account();
            newAccount.setId(userId);
            newAccount.setEmail(email);
            newAccount.setFullname(fullname);
            newAccount.setVerified(true);
            newAccount.setCreatedDate(new Date());
            
            // Set a random password (user won't use it)
            newAccount.setPassword(UUID.randomUUID().toString());
            
            // Save the new account
            return dao.save(newAccount);
        }));
        
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Mã thông báo làm mới đã hết hạn. Vui lòng thực hiện yêu cầu đăng nhập mới");
        }

        return token;
    }

    @Transactional
    public int deleteByAccountId(String userId) {
        return refreshTokenRepository.deleteByAccount(dao.findById(userId).get());
    }
}
