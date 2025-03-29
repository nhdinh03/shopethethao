package com.shopethethao.auth.security.oauth2google;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.modules.role.ERole;
import com.shopethethao.modules.role.Role;
import com.shopethethao.modules.role.RoleDAO;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    @Autowired
    private AccountDAO accountDAO;
    
    @Autowired
    private RoleDAO roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("OAuth2 authentication error", ex);
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String provider = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo = getOAuth2UserInfo(provider, oAuth2User);
        
        if(!StringUtils.hasText(userInfo.getEmail())) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }
        
        try {
            Optional<Account> existingAccount = accountDAO.findByEmail(userInfo.getEmail());
            Account account;
            
            if(existingAccount.isPresent()) {
                // Just use existing account without modifications
                account = existingAccount.get();
                logger.info("Using existing account for OAuth2 login: {}", account.getId());
            } else {
                account = registerNewUser(userInfo, provider);
                logger.info("Registered new OAuth2 user: {}", account.getId());
            }
            
            return OAuth2UserPrincipal.create(account, oAuth2User.getAttributes());
        } catch (Exception ex) {
            logger.error("Error processing OAuth2 user: {}", ex.getMessage());
            throw new InternalAuthenticationServiceException("Error processing OAuth2 user", ex);
        }
    }

    private OAuth2UserInfo getOAuth2UserInfo(String provider, OAuth2User oAuth2User) {
        if(provider.equalsIgnoreCase("google")) {
            return new GoogleOAuth2UserInfo(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Login with " + provider + " is not supported yet");
        }
    }

    private Account registerNewUser(OAuth2UserInfo userInfo, String provider) {
        // Double-check for existing account to prevent race conditions
        Optional<Account> existingAccount = accountDAO.findByEmail(userInfo.getEmail());
        if (existingAccount.isPresent()) {
            return updateExistingUser(existingAccount.get(), userInfo);
        }

        Account account = new Account();
        account.setId(provider + "_" + userInfo.getId());
        account.setEmail(userInfo.getEmail());
        account.setFullname(userInfo.getName());
        account.setImage(userInfo.getImageUrl());
        
        account.setCreatedDate(new Date());
        account.setStatus(1);
        account.setVerified(true); // Auto-verify OAuth users
        
        // Generate a random phone number if needed for DB constraints
        String randomPhone = "OA" + Math.abs(UUID.randomUUID().getMostSignificantBits() % 10000000000L);
        account.setPhone(randomPhone);
        
        // Set a random password since we won't use it for OAuth users
        account.setPassword(new BCryptPasswordEncoder().encode(UUID.randomUUID().toString()));
        
        // Set USER role
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.USER)
                .orElseThrow(() -> new RuntimeException("Error: Role USER not found"));
        roles.add(userRole);
        account.setRoles(roles);
        
        logger.info("Creating new OAuth2 user account: {}", account.getId());
        
        try {
            return accountDAO.save(account);
        } catch (Exception e) {
            logger.error("Failed to register new user: {}", e.getMessage());
            throw e;
        }
    }

    private Account updateExistingUser(Account account, OAuth2UserInfo userInfo) {
        // Update only if data has changed
        if (!account.getFullname().equals(userInfo.getName())) {
            account.setFullname(userInfo.getName());
        }
        
        if (userInfo.getImageUrl() != null && !userInfo.getImageUrl().equals(account.getImage())) {
            account.setImage(userInfo.getImageUrl());
        }
        
        // Remove all references to provider field
        
        return accountDAO.save(account);
    }
}
