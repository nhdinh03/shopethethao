package com.shopethethao.dto;

import com.shopethethao.modules.userHistory.UserActionType;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserHistoryDTO {
    private Long idHistory; // Changed from Integer to Long to match entity
    private String userId;
    private String username;
    private String userRole;
    private UserActionType actionType;
    private String note;
    private String ipAddress;
    private String deviceInfo;
    private LocalDateTime historyDateTime;
    private Integer status;
}