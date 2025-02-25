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
@RequestMapping("/api/userhistory-sse") // Changed base path to avoid conflict
public class UserHistoryAPI {
    @Autowired
    UserHistoryDAO userHistoriesDAO;

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
            logger.error("Error fetching user histories: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private UserHistoryDTO convertToDTO(UserHistory history) {
        UserHistoryDTO dto = new UserHistoryDTO();
        dto.setIdHistory(history.getIdHistory());
        dto.setUserId(history.getUserId());
        dto.setUsername(history.getUsername()); // Add this line
        dto.setUserRole(history.getUserRole()); // Add this line
        dto.setNote(history.getNote());
        dto.setHistoryDateTime(history.getHistoryDateTime());
        dto.setActionType(history.getActionType());
        dto.setIpAddress(history.getIpAddress());
        dto.setDeviceInfo(history.getDeviceInfo());
        dto.setStatus(history.getStatus());
        dto.setReadStatus(history.getReadStatus()); // Ensure readStatus is included
        return dto;
    }

    @Autowired
    public UserHistoryAPI(UserHistoryService userHistoryService, UserHistorySSEService sseService) {
        this.userHistoryService = userHistoryService;
        this.sseService = sseService;
    }

    @GetMapping(path = "/stream/auth-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAuthActivities(HttpServletRequest request) {
        logger.info("New auth activities SSE connection from: {}", request.getRemoteAddr());
        SseEmitter emitter = sseService.createAuthEmitter();

        // Send initial data immediately
        userHistoryService.sendInitialAuthActivitiesToEmitter(emitter);

        logger.info("Auth emitters count: {}", sseService.getAuthEmitterCount());
        return emitter;
    }

    @GetMapping(path = "/stream/admin-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAdminActivities(HttpServletRequest request) {
        logger.info("New admin activities SSE connection from: {}", request.getRemoteAddr());
        SseEmitter emitter = sseService.createAdminEmitter();

        // Send initial data immediately
        userHistoryService.sendInitialAdminActivitiesToEmitter(emitter);

        logger.info("Admin emitters count: {}", sseService.getAdminEmitterCount());
        return emitter;
    }

    @GetMapping("/auth-activities")
    public ResponseEntity<?> getAuthActivities() {
        Map<String, List<?>> response = new HashMap<>();
        response.put("content", userHistoryService.getLatestAuthActivities());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin-activities")
    public ResponseEntity<?> getAdminActivities() {
        Map<String, List<?>> response = new HashMap<>();
        response.put("content", userHistoryService.getLatestAdminActivities());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{historyId}/mark-as-read")
    public ResponseEntity<?> markAsRead(@PathVariable Long historyId) {
        boolean success = userHistoryService.markAsRead(historyId);
        return success ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/mark-all-auth-as-read")
    public ResponseEntity<?> markAllAuthAsRead() {
        userHistoryService.markAllAuthAsRead();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mark-all-admin-as-read")
    public ResponseEntity<?> markAllAdminAsRead() {
        userHistoryService.markAllAdminAsRead();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        Map<String, Integer> counts = userHistoryService.getUnreadCounts();
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/status")
    public ResponseEntity<?> getSseStatus() {
        return ResponseEntity.ok(
                java.util.Map.of(
                        "authEmitterCount", sseService.getAuthEmitterCount(),
                        "adminEmitterCount", sseService.getAdminEmitterCount()));
    }
}
