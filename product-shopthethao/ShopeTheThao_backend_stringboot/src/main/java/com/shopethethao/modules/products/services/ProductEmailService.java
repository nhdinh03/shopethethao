package com.shopethethao.modules.products.services;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopethethao.auth.otp.util.EmailUtil;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.products.ProductsDAO;
import com.shopethethao.modules.role.ERole;
import com.shopethethao.modules.role.Role;

@Service
public class ProductEmailService {

    private static final Logger logger = LoggerFactory.getLogger(ProductEmailService.class);
    private static final int BATCH_SIZE = 50;
    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY = 1000L;

    @Autowired
    private AccountDAO accountDAO;

    @Autowired
    private ProductsDAO productsDAO;

    @Autowired
    private EmailUtil emailUtil;

    @Async("asyncExecutor")
    @Transactional(readOnly = true)
    public void notifyUsersAboutNewProduct(Product product) {
        try {
            // Fetch fresh product data
            Product freshProduct = productsDAO.findById(product.getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Send to admin first
            sendEmailWithRetry("nhdinhpc03@gmail.com", freshProduct);

            // Get active users in batches to avoid memory issues
            int offset = 0;
            while (true) {
                List<Account> userBatch = accountDAO.findActiveUsersWithVerifiedEmail(offset, BATCH_SIZE);
                if (userBatch.isEmpty()) {
                    break;
                }

                CompletableFuture<?>[] futures = userBatch.stream()
                    .filter(this::isValidEmailForNotification)
                    .map(user -> CompletableFuture.runAsync(() -> 
                        sendEmailWithRetry(user.getEmail(), freshProduct)))
                    .toArray(CompletableFuture[]::new);

                // Wait for all emails in batch to complete
                CompletableFuture.allOf(futures).join();
                
                offset += BATCH_SIZE;
                // Small delay between batches
                Thread.sleep(100);
            }
            
            logger.info("Completed sending notifications for new product ID: {}", product.getId());
        } catch (Exception e) {
            logger.error("Error in notifyUsersAboutNewProduct: {}", e.getMessage());
        }
    }

    private void sendEmailWithRetry(String email, Product product) {
        int attempts = 0;
        while (attempts < MAX_RETRIES) {
            try {
                emailUtil.sendNewProductEmail(email, product);
                logger.debug("Successfully sent product notification to: {}", email);
                return;
            } catch (Exception e) {
                attempts++;
                if (attempts == MAX_RETRIES) {
                    logger.error("Failed to send email to {} after {} attempts: {}", 
                        email, MAX_RETRIES, e.getMessage());
                } else {
                    logger.warn("Retry {} for sending email to {}", attempts, email);
                    try {
                        Thread.sleep(RETRY_DELAY * attempts);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }
    }

    private boolean isValidEmailForNotification(Account user) {
        return user != null
                && user.getEmail() != null
                && !user.getEmail().isEmpty()
                && user.getVerified() // Chỉ gửi cho tài khoản đã xác thực
                && user.getStatus() == 1 // Tài khoản đang hoạt động
                && !isAdminAccount(user); // Không gửi cho tài khoản admin
    }

    private boolean isAdminAccount(Account user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .anyMatch(roleName
                        -> roleName == ERole.ADMIN
                || roleName == ERole.STAFF);
    }
}
