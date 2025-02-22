package com.shopethethao.modules.userHistory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Arrays;
import jakarta.persistence.criteria.Predicate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.data.jpa.domain.Specification;

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
        dto.setUsername(history.getUsername());    // Add this line
        dto.setUserRole(history.getUserRole());    // Add this line
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
            @PageableDefault(size = 10, sort = "historyDateTime", direction = Sort.Direction.DESC) Pageable pageable) {

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

    @GetMapping("/auth-activities")
    public ResponseEntity<Page<UserHistoryDTO>> getAuthActivities(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String userId,
            @PageableDefault(size = 10, sort = "historyDateTime", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Specification<UserHistory> spec = (root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();
                
                predicates.add(root.get("actionType").in(
                    Arrays.asList(UserActionType.LOGIN, UserActionType.LOGOUT,
                                UserActionType.LOGIN_FAILED, UserActionType.RELOGIN)
                ));

                if (startDate != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("historyDateTime"), startDate));
                }
                if (endDate != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("historyDateTime"), endDate));
                }
                if (userId != null && !userId.isEmpty()) {
                    predicates.add(cb.equal(root.get("account").get("id"), userId));
                }

                return cb.and(predicates.toArray(new Predicate[0]));
            };

            Page<UserHistory> histories = userHistoriesDAO.findAll(spec, pageable);
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
                    .body(histories.map(this::convertToDTO));
        } catch (Exception e) {
            logger.error("Error fetching auth activities: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin-activities")
    public ResponseEntity<Page<UserHistoryDTO>> getAdminActivities(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String adminId,
            @RequestParam(required = false) String actionType,
            @PageableDefault(size = 10, sort = "historyDateTime", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Specification<UserHistory> spec = (root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();
                
                if (actionType != null && !actionType.isEmpty()) {
                    predicates.add(cb.equal(root.get("actionType"), UserActionType.valueOf(actionType)));
                } else {
                    List<UserActionType> adminActions = Arrays.stream(UserActionType.values())
                        .filter(UserActionType::isAdminAction)
                        .collect(Collectors.toList());
                    predicates.add(root.get("actionType").in(adminActions));
                }

                if (startDate != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("historyDateTime"), startDate));
                }
                if (endDate != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("historyDateTime"), endDate));
                }
                if (adminId != null && !adminId.isEmpty()) {
                    predicates.add(cb.equal(root.get("account").get("id"), adminId));
                }

                return cb.and(predicates.toArray(new Predicate[0]));
            };

            Page<UserHistory> histories = userHistoriesDAO.findAll(spec, pageable);
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
                    .body(histories.map(this::convertToDTO));
        } catch (Exception e) {
            logger.error("Error fetching admin activities: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

     
    private final Map<String, SseEmitter> authEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> adminEmitters = new ConcurrentHashMap<>();
    
    // Existing endpoints...
    
    @GetMapping("/auth-activities/stream")
    public SseEmitter streamAuthActivities() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        String emitterId = UUID.randomUUID().toString();
        authEmitters.put(emitterId, emitter);
        
        emitter.onCompletion(() -> authEmitters.remove(emitterId));
        emitter.onTimeout(() -> authEmitters.remove(emitterId));
        
        return emitter;
    }
    
    @GetMapping("/admin-activities/stream")
    public SseEmitter streamAdminActivities() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        String emitterId = UUID.randomUUID().toString();
        adminEmitters.put(emitterId, emitter);
        
        emitter.onCompletion(() -> adminEmitters.remove(emitterId));
        emitter.onTimeout(() -> adminEmitters.remove(emitterId));
        
        return emitter;
    }
    
    @PostMapping("/auth-activities")
    public ResponseEntity<?> resetAuthActivities() {
        try {
            // Add your reset logic here
            // For example: clear auth activities or reset to default state
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error resetting auth activities: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/admin-activities")
    public ResponseEntity<?> resetAdminActivities() {
        try {
            // Add your reset logic here
            // For example: clear admin activities or reset to default state
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error resetting admin activities: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Method to notify all clients when data changes
    private void notifyAuthClients(List<UserHistory> activities) {
        authEmitters.forEach((id, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                    .data(activities)
                    .name("auth-activities"));
            } catch (IOException e) {
                authEmitters.remove(id);
            }
        });
    }
    
    private void notifyAdminClients(List<UserHistory> activities) {
        adminEmitters.forEach((id, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                    .data(activities)
                    .name("admin-activities"));
            } catch (IOException e) {
                adminEmitters.remove(id);
            }
        });
    }
}