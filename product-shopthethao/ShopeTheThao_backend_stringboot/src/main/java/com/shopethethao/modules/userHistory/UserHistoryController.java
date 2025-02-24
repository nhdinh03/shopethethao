package com.shopethethao.modules.userHistory;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.shopethethao.service.UserHistorySSEService;
import com.shopethethao.service.UserHistoryService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/userhistory")
public class UserHistoryController {
    private final UserHistoryService userHistoryService;
    private final UserHistorySSEService sseService;

    @Autowired
    public UserHistoryController(UserHistoryService userHistoryService, UserHistorySSEService sseService) {
        this.userHistoryService = userHistoryService;
        this.sseService = sseService;
    }

    @GetMapping(path = "/sse/auth-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAuthActivities() {
        return sseService.createAuthEmitter();
    }

    @GetMapping(path = "/sse/admin-activities", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAdminActivities() {
        return sseService.createAdminEmitter();
    }

}
