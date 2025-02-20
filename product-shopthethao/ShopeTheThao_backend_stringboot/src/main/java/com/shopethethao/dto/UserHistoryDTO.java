package com.shopethethao.dto;

import java.time.LocalDateTime;
import com.shopethethao.modules.userHistory.UserActionType;
import lombok.Data;

@Data
public class UserHistoryDTO {
    private Integer idHistory;
    private String userId;
    private String username;
    private UserActionType actionType;
    private String note;
    private String ipAddress;
    private String deviceInfo;
    private LocalDateTime historyDateTime;
    private String userRole;
    private Boolean status;
}