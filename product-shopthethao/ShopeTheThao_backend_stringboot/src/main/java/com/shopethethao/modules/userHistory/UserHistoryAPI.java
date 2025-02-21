package com.shopethethao.modules.userHistory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.UserHistoryDTO;

@RestController
@RequestMapping("/api/userhistory")
public class UserHistoryAPI {
    private static final Logger logger = LoggerFactory.getLogger(UserHistoryAPI.class);
    @Autowired
    UserHistoryDAO userHistoriesDAO;

    @Autowired
    UserHistoryService userHistoryService;

    @GetMapping("/get/all")
    public ResponseEntity<List<UserHistoryDTO>> findAll() {
        try {
            List<UserHistory> histories = userHistoriesDAO.findAll();
            List<UserHistoryDTO> dtos = histories.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Error fetching user histories: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private UserHistoryDTO convertToDTO(UserHistory history) {
        UserHistoryDTO dto = new UserHistoryDTO();
        dto.setIdHistory(history.getIdHistory());
        dto.setUserId(history.getUserId());  // Use userId directly
        dto.setNote(history.getNote());
        dto.setHistoryDateTime(history.getHistoryDateTime());
        dto.setActionType(history.getActionType());
        dto.setIpAddress(history.getIpAddress());
        dto.setDeviceInfo(history.getDeviceInfo());
        dto.setStatus(history.getStatus());
        return dto;
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<UserHistoryDTO>> getHistoryWithFilters(
            @RequestParam(required = false) UserActionType actionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String userId,
            @PageableDefault(size = 10) Pageable pageable) {

        try {
            if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest().body(null);
            }

            Page<UserHistoryDTO> histories = userHistoryService.getHistoryWithFilters(
                    actionType, startDate, endDate, userId, pageable);
                    
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
                    .body(histories);
        } catch (Exception e) {
            logger.error("Error filtering user histories: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserHistoryDTO>> getUserHistory(
            @PathVariable String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        try {
            if (startDate == null) {
                startDate = LocalDateTime.now().minusMonths(1);
            }
            if (endDate == null) {
                endDate = LocalDateTime.now();
            }

            List<UserHistoryDTO> histories = userHistoryService.getUserHistoryByDateRange(userId, startDate, endDate);
            return ResponseEntity.ok(histories);
        } catch (Exception e) {
            logger.error("Error fetching user history: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getActionStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        try {
            Map<UserActionType, Long> stats = userHistoryService.getActionStatistics(startDate, endDate);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error getting action statistics: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}