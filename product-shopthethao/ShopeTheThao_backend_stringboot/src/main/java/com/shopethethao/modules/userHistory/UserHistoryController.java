package com.shopethethao.modules.userHistory;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.shopethethao.service.UserHistorySSEService;
import com.shopethethao.service.UserHistoryService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/userhistory")
public class UserHistoryController {
    private static final Logger logger = LoggerFactory.getLogger(UserHistoryController.class);
    private final UserHistoryService userHistoryService;
    private final UserHistorySSEService sseService;

    @Autowired
    public UserHistoryController(UserHistoryService userHistoryService, UserHistorySSEService sseService) {
        this.userHistoryService = userHistoryService;
        this.sseService = sseService;
    }

    @GetMapping(path = "/sse/auth-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAuthActivities(HttpServletRequest request) {
        logger.info("New auth activities SSE connection from: {}", request.getRemoteAddr());
        SseEmitter emitter = sseService.createAuthEmitter();
        
        // Send initial data immediately
        userHistoryService.sendInitialAuthActivitiesToEmitter(emitter);
        
        logger.info("Auth emitters count: {}", sseService.getAuthEmitterCount());
        return emitter;
    }

    @GetMapping(path = "/sse/admin-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAdminActivities(HttpServletRequest request) {
        logger.info("New admin activities SSE connection from: {}", request.getRemoteAddr());
        SseEmitter emitter = sseService.createAdminEmitter();
        
        // Send initial data immediately
        userHistoryService.sendInitialAdminActivitiesToEmitter(emitter);
        
        logger.info("Admin emitters count: {}", sseService.getAdminEmitterCount());
        return emitter;
    }
    
    @GetMapping("/sse/status")
    public ResponseEntity<?> getSseStatus() {
        return ResponseEntity.ok(
            java.util.Map.of(
                "authEmitterCount", sseService.getAuthEmitterCount(),
                "adminEmitterCount", sseService.getAdminEmitterCount()
            )
        );
    }
}
