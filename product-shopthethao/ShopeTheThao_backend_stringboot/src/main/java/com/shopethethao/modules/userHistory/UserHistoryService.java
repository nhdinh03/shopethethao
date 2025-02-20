package com.shopethethao.modules.userHistory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.shopethethao.dto.UserHistoryDTO;

@Service
public class UserHistoryService {

    @Autowired
    private UserHistoryDAO userHistoryDAO;

    public void logUserAction(String userId, UserActionType actionType, String note, String ipAddress, String deviceInfo) {
        if (userId == null || actionType == null) {
            throw new IllegalArgumentException("UserId and actionType cannot be null");
        }
        
        UserHistory history = new UserHistory();
        history.setActionType(actionType);
        history.setNote(note);
        history.setIpAddress(ipAddress);
        history.setDeviceInfo(deviceInfo);
        history.setHistoryDateTime(LocalDateTime.now());
        userHistoryDAO.save(history);
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
                .filter(history -> history.getUser().getId().equals(userId))
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
        dto.setUserId(history.getUser().getId());
        dto.setUsername(history.getUser().getFullname());
        dto.setActionType(history.getActionType());
        dto.setNote(history.getNote());
        dto.setIpAddress(history.getIpAddress());
        dto.setDeviceInfo(history.getDeviceInfo());
        dto.setHistoryDateTime(history.getHistoryDateTime());
        dto.setStatus(history.getStatus());
        
        // Optimize role extraction
        if (history.getUser() != null && history.getUser().getRoles() != null) {
            history.getUser().getRoles().stream()
                  .findFirst()
                  .ifPresent(role -> dto.setUserRole(role.getName().toString()));
        }
        
        return dto;
    }
}
