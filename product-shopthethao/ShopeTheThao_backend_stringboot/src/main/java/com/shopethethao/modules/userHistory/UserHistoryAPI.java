package com.shopethethao.modules.userHistory;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.shopethethao.dto.UserHistoryDTO;
import com.shopethethao.service.UserHistorySSEService;
import com.shopethethao.service.UserHistoryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/userhistory-sse")
public class UserHistoryAPI {
    @Autowired
    UserHistoryDAO userHistoriesDAO;

    @Autowired
    public UserHistoryAPI(UserHistoryService userHistoryService, UserHistorySSEService sseService) {
        this.userHistoryService = userHistoryService;
        this.sseService = sseService;
    }

    private static final Logger logger = LoggerFactory.getLogger(UserHistoryAPI.class);
    private final UserHistoryService userHistoryService;
    private final UserHistorySSEService sseService;

    @GetMapping("/get/all")
    public ResponseEntity<List<UserHistoryDTO>> findAll() {
        try {
            Sort sort = Sort.by(Sort.Direction.DESC, "historyDateTime");
            List<UserHistory> histories = userHistoriesDAO.findAll(sort);
            List<UserHistoryDTO> dtos = histories.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Error fetching user histories: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private UserHistoryDTO convertToDTO(UserHistory history) {
        UserHistoryDTO dto = new UserHistoryDTO();
        dto.setIdHistory(history.getIdHistory());
        dto.setUserId(history.getUserId());
        dto.setUsername(history.getUsername());
        dto.setUserRole(history.getUserRole());
        dto.setNote(history.getNote());
        dto.setHistoryDateTime(history.getHistoryDateTime());
        dto.setActionType(history.getActionType());
        dto.setIpAddress(history.getIpAddress());
        dto.setDeviceInfo(history.getDeviceInfo());
        dto.setStatus(history.getStatus());
        dto.setReadStatus(history.getReadStatus());
        return dto;
    }

    @GetMapping(path = "/stream/auth-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAuthActivities(HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        logger.info("New auth activities SSE connection from: {}", clientIp);

        SseEmitter emitter = sseService.createAuthEmitter();
        if (emitter == null) {
            logger.debug("Failed to create auth emitter for {}, client may have disconnected", clientIp);
            return new SseEmitter(0L); // Trả về emitter rỗng để kết thúc ngay
        }

        try {
            userHistoryService.sendInitialAuthActivitiesToEmitter(emitter);
        } catch (Exception e) {
            logger.debug("Failed to send initial auth activities to {}: {}", clientIp, e.getMessage());
            emitter.completeWithError(e);
        }

        logger.info("Auth emitters count: {}", sseService.getAuthEmitterCount());
        return emitter;
    }

    @GetMapping(path = "/stream/admin-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAdminActivities(HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        logger.info("New admin activities SSE connection from: {}", clientIp);

        SseEmitter emitter = sseService.createAdminEmitter();
        if (emitter == null) {
            logger.debug("Failed to create admin emitter for {}, client may have disconnected", clientIp);
            return new SseEmitter(0L); // Trả về emitter rỗng để kết thúc ngay
        }

        try {
            userHistoryService.sendInitialAdminActivitiesToEmitter(emitter);
        } catch (Exception e) {
            logger.debug("Failed to send initial admin activities to {}: {}", clientIp, e.getMessage());
            emitter.completeWithError(e);
        }

        logger.info("Admin emitters count: {}", sseService.getAdminEmitterCount());
        return emitter;
    }

    @GetMapping("/auth-activities")
    public ResponseEntity<?> getAuthActivities() {
        try {
            Map<String, List<?>> response = new HashMap<>();
            response.put("content", userHistoryService.getLatestAuthActivities());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching auth activities: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin-activities")
    public ResponseEntity<?> getAdminActivities() {
        try {
            Map<String, List<?>> response = new HashMap<>();
            response.put("content", userHistoryService.getLatestAdminActivities());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching admin activities: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{historyId}/mark-as-read")
    public ResponseEntity<?> markAsRead(@PathVariable Long historyId) {
        try {
            boolean success = userHistoryService.markAsRead(historyId);
            return success ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error marking history {} as read: {}", historyId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/mark-all-auth-as-read")
    public ResponseEntity<?> markAllAuthAsRead() {
        try {
            userHistoryService.markAllAuthAsRead();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking all auth as read: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/mark-all-admin-as-read")
    public ResponseEntity<?> markAllAdminAsRead() {
        try {
            userHistoryService.markAllAdminAsRead();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking all admin as read: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        try {
            Map<String, Integer> counts = userHistoryService.getUnreadCounts();
            return ResponseEntity.ok(counts);
        } catch (Exception e) {
            logger.error("Error fetching unread counts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getSseStatus() {
        try {
            return ResponseEntity.ok(
                    Map.of(
                            "authEmitterCount", sseService.getAuthEmitterCount(),
                            "adminEmitterCount", sseService.getAdminEmitterCount()));
        } catch (Exception e) {
            logger.error("Error fetching SSE status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}