package com.shopethethao.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class UserHistorySSEService {
    private static final Logger logger = LoggerFactory.getLogger(UserHistorySSEService.class);
    private final CopyOnWriteArrayList<SseEmitter> authEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();
    private final ScheduledExecutorService heartbeatExecutor = Executors.newSingleThreadScheduledExecutor();

    public UserHistorySSEService() {
        // Send heartbeat every 30 seconds to keep connections alive
        heartbeatExecutor.scheduleAtFixedRate(this::sendHeartbeat, 0, 30, TimeUnit.SECONDS);
    }

    public SseEmitter createAuthEmitter() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        this.authEmitters.add(emitter);
        
        emitter.onCompletion(() -> {
            this.authEmitters.remove(emitter);
            logger.debug("Auth emitter completed and removed, remaining: {}", authEmitters.size());
        });
        
        emitter.onTimeout(() -> {
            this.authEmitters.remove(emitter);
            logger.debug("Auth emitter timed out and removed, remaining: {}", authEmitters.size());
        });
        
        emitter.onError((e) -> {
            this.authEmitters.remove(emitter);
            logger.error("Auth emitter error: {}", e.getMessage());
        });

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connection established"));
        } catch (IOException e) {
            logger.error("Error during auth emitter initialization", e);
        }
        
        return emitter;
    }

    public SseEmitter createAdminEmitter() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        this.adminEmitters.add(emitter);
        
        emitter.onCompletion(() -> {
            this.adminEmitters.remove(emitter);
            logger.debug("Admin emitter completed and removed, remaining: {}", adminEmitters.size());
        });
        
        emitter.onTimeout(() -> {
            this.adminEmitters.remove(emitter);
            logger.debug("Admin emitter timed out and removed, remaining: {}", adminEmitters.size());
        });
        
        emitter.onError((e) -> {
            this.adminEmitters.remove(emitter);
            logger.error("Admin emitter error: {}", e.getMessage());
        });

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connection established"));
        } catch (IOException e) {
            logger.error("Error during admin emitter initialization", e);
        }
        
        return emitter;
    }

    public void notifyAuthActivity(Object data) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        authEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                    .name("AUTH_ACTIVITY")
                    .data(data)
                    .id(String.valueOf(System.currentTimeMillis())));
                logger.debug("Sent auth activity update to emitter");
            } catch (IOException e) {
                logger.error("Failed to send auth activity update: {}", e.getMessage());
                deadEmitters.add(emitter);
            }
        });

        if (!deadEmitters.isEmpty()) {
            logger.debug("Removing {} dead auth emitters", deadEmitters.size());
            authEmitters.removeAll(deadEmitters);
        }
    }

    public void notifyAdminActivity(Object data) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        adminEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                    .name("ADMIN_ACTIVITY")
                    .data(data)
                    .id(String.valueOf(System.currentTimeMillis())));
                logger.debug("Sent admin activity update to emitter");
            } catch (IOException e) {
                logger.error("Failed to send admin activity update: {}", e.getMessage());
                deadEmitters.add(emitter);
            }
        });

        if (!deadEmitters.isEmpty()) {
            logger.debug("Removing {} dead admin emitters", deadEmitters.size());
            adminEmitters.removeAll(deadEmitters);
        }
    }

    private void sendHeartbeat() {
        List<SseEmitter> deadAuthEmitters = new ArrayList<>();
        List<SseEmitter> deadAdminEmitters = new ArrayList<>();

        // Send heartbeat to auth emitters
        authEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                    .name("HEARTBEAT")
                    .data("ping")
                    .id(String.valueOf(System.currentTimeMillis())));
            } catch (IOException e) {
                deadAuthEmitters.add(emitter);
            }
        });

        // Send heartbeat to admin emitters
        adminEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                    .name("HEARTBEAT")
                    .data("ping")
                    .id(String.valueOf(System.currentTimeMillis())));
            } catch (IOException e) {
                deadAdminEmitters.add(emitter);
            }
        });

        // Remove dead emitters
        if (!deadAuthEmitters.isEmpty()) {
            authEmitters.removeAll(deadAuthEmitters);
            logger.debug("Removed {} dead auth emitters during heartbeat", deadAuthEmitters.size());
        }
        
        if (!deadAdminEmitters.isEmpty()) {
            adminEmitters.removeAll(deadAdminEmitters);
            logger.debug("Removed {} dead admin emitters during heartbeat", deadAdminEmitters.size());
        }
    }
    
    public int getAuthEmitterCount() {
        return authEmitters.size();
    }
    
    public int getAdminEmitterCount() {
        return adminEmitters.size();
    }
}
