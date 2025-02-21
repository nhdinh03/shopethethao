// package com.shopethethao.modules.userHistory;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import jakarta.servlet.http.HttpServletRequest;
// import lombok.extern.slf4j.Slf4j;

// @Slf4j
// @Component
// public class UserActionUtils {

//     @Autowired
//     private UserHistoryService userHistoryService;

//     private String getCurrentUserId() {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         if (authentication != null && authentication.isAuthenticated()) {
//             String userId = authentication.getName();
//             log.debug("Current user ID: {}", userId);
//             return userId;
//         }
//         log.warn("No authenticated user found");
//         return null;
//     }

//     public void logAction(UserActionType actionType, String description, HttpServletRequest request) {
//         String userId = getCurrentUserId();
//         if (userId != null) {
//             try {
//                 userHistoryService.logUserAction(
//                     userId,
//                     actionType,
//                     description,
//                     request.getRemoteAddr(),
//                     request.getHeader("User-Agent")
//                 );
//                 log.info("Action logged - Type: {}, User: {}, Description: {}", 
//                     actionType, userId, description);
//             } catch (Exception e) {
//                 log.error("Failed to log action: {} for user: {}", actionType, userId, e);
//             }
//         }
//     }
// }