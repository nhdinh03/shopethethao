package com.shopethethao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopethethao.modules.userHistory.UserActionType;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AdminLogService {

    @Autowired
    private UserHistoryService userHistoryService;

    public void logAdminAction(String adminUsername, HttpServletRequest request, String action, 
            String modulePrefix) {
        try {
            UserActionType actionType = determineActionType(action, modulePrefix);
            userHistoryService.logUserAction(
                    adminUsername,
                    actionType,
                    action,
                    getClientIp(request),
                    request.getHeader("User-Agent"));
            
            log.debug("Admin action logged - user: {}, action: {}", adminUsername, action);
        } catch (Exception e) {
            log.error("Failed to log admin action - user: {}, action: {}, error: {}", 
                adminUsername, action, e.getMessage());
        }
    }

    private UserActionType determineActionType(String action, String modulePrefix) {
        if (action.startsWith("CẬP NHẬT")) {
            return UserActionType.valueOf("UPDATE_" + modulePrefix);
        } else if (action.startsWith("XÓA")) {
            return UserActionType.valueOf("DELETE_" + modulePrefix);
        } else if (action.startsWith("THÊM")) {
            return UserActionType.valueOf("CREATE_" + modulePrefix);
        } else {
            return UserActionType.ADMIN_ACTION;
        }
    }

    public String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
