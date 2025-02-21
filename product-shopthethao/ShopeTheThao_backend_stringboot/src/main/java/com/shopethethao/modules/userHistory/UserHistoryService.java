package com.shopethethao.modules.userHistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.shopethethao.dto.UserHistoryDTO;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.modules.account.Account;

@Slf4j
@Service
public class UserHistoryService {

    @Autowired
    private UserHistoryDAO userHistoryDAO;
    
    @Autowired
    private AccountDAO accountDAO;

    @Transactional
    public void logUserAction(String userId, UserActionType actionType, String note, String ipAddress, String deviceInfo) {
        if (userId == null || userId.trim().isEmpty()) {
            log.error("Cannot log user action: userId is null or empty");
            throw new IllegalArgumentException("userId cannot be null or empty");
        }

        try {
            Account account = accountDAO.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

            UserHistory history = new UserHistory();
            history.setAccount(account);
            history.setActionType(actionType);
            history.setNote(note);
            
            // Format IP address if it's localhost
            if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
                ipAddress = "127.0.0.1";
            }
            
            history.setIpAddress(ipAddress != null ? ipAddress : "unknown");
            history.setDeviceInfo(deviceInfo != null ? deviceInfo : "unknown");
            history.setHistoryDateTime(LocalDateTime.now());
            history.setStatus(1);

            userHistoryDAO.save(history);
            log.debug("Successfully logged action {} for user {}", actionType, userId);
        } catch (Exception e) {
            log.error("Failed to log user action for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to log user action", e);
        }
    }

    public List<UserHistoryDTO> getHistoryByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return userHistoryDAO.findByDateRange(startDate, endDate)
                           .stream()
                           .map(this::convertToDTO)
                           .collect(Collectors.toList());
    }

    public Page<UserHistoryDTO> getHistoryWithFilters(
            UserActionType actionType,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String userId,
            Pageable pageable) {
        
        return userHistoryDAO.findWithFilters(actionType, startDate, endDate, userId, pageable)
                           .map(this::convertToDTO);
    }

    public List<UserHistoryDTO> getUserHistoryByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return userHistoryDAO.findByDateRange(startDate, endDate).stream()
                .filter(history -> history.getUserId().equals(userId))  // Changed from history.getUser().getId()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<UserActionType, Long> getActionStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<UserHistory> histories = userHistoryDAO.findByDateRange(startDate, endDate);
        return histories.stream()
                .collect(Collectors.groupingBy(
                    UserHistory::getActionType,
                    Collectors.counting()
                ));
    }

    private UserHistoryDTO convertToDTO(UserHistory history) {
        if (history == null) {
            return null;
        }

        UserHistoryDTO dto = new UserHistoryDTO();
        dto.setIdHistory(history.getIdHistory());
        dto.setUserId(history.getUserId());
        dto.setUsername(history.getUsername());    // Add this line
        dto.setUserRole(history.getUserRole());    // Add this line
        dto.setActionType(history.getActionType());
        dto.setNote(history.getNote());
        dto.setIpAddress(history.getIpAddress());
        dto.setDeviceInfo(history.getDeviceInfo());
        dto.setHistoryDateTime(history.getHistoryDateTime());
        dto.setStatus(history.getStatus());
        
        return dto;
    }
}
