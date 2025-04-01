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

import jakarta.annotation.PreDestroy;

@Service
public class UserHistorySSEService {
    private static final Logger logger = LoggerFactory.getLogger(UserHistorySSEService.class);

    private final CopyOnWriteArrayList<SseEmitter> authEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();
    private final ScheduledExecutorService heartbeatExecutor = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "SSE-Heartbeat-Thread");
        t.setDaemon(true);
        return t;
    });

    private static final long TIMEOUT = 120_000L; // 2 phút
    private static final long HEARTBEAT_DELAY = 5; // 5 giây
    private static final int MAX_EMITTERS = 100;

    public UserHistorySSEService() {
        heartbeatExecutor.scheduleAtFixedRate(this::sendHeartbeat, 0, HEARTBEAT_DELAY, TimeUnit.SECONDS);
    }

    @PreDestroy
    public void shutdown() {
        heartbeatExecutor.shutdown();
        try {
            if (!heartbeatExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                heartbeatExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            logger.error("Error shutting down heartbeat executor", e);
            Thread.currentThread().interrupt();
        }
        completeAllEmitters(authEmitters, "auth");
        completeAllEmitters(adminEmitters, "admin");
    }

    public SseEmitter createAuthEmitter() {
        return createEmitter(authEmitters, true);
    }

    public SseEmitter createAdminEmitter() {
        return createEmitter(adminEmitters, false);
    }

    private SseEmitter createEmitter(CopyOnWriteArrayList<SseEmitter> emitters, boolean isAuth) {
        cleanDeadEmitters(emitters, isAuth);

        if (emitters.size() >= MAX_EMITTERS) {
            logger.warn("Max emitters reached ({}), removing oldest emitter for {}", MAX_EMITTERS,
                    isAuth ? "auth" : "admin");
            completeEmitter(emitters.remove(0));
        }

        SseEmitter emitter = new SseEmitter(TIMEOUT);
        emitters.add(emitter);

        setupEmitterCallbacks(emitter, emitters, isAuth);

        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("Connection established")
                    .reconnectTime(5000));
            logger.debug("Successfully initialized {} emitter", isAuth ? "auth" : "admin");
        } catch (IOException e) {
            logger.debug("Failed to initialize {} emitter due to client disconnection: {}", 
                    isAuth ? "auth" : "admin", e.getMessage());
            emitters.remove(emitter);
            completeEmitter(emitter);
            return null;
        }
        return emitter;
    }

    private void setupEmitterCallbacks(SseEmitter emitter, CopyOnWriteArrayList<SseEmitter> emitters, boolean isAuth) {
        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            logger.debug("Emitter completed for {}", isAuth ? "auth" : "admin");
        });
        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            logger.debug("Emitter timed out for {}", isAuth ? "auth" : "admin");
        });
        emitter.onError(e -> {
            emitters.remove(emitter);
            logger.debug("Emitter error for {}: {}", isAuth ? "auth" : "admin", e.getMessage());
        });
    }

    private void sendHeartbeat() {
        try {
            sendToEmitters(authEmitters, "HEARTBEAT", "ping", true);
            sendToEmitters(adminEmitters, "HEARTBEAT", "ping", false);
        } catch (Exception e) {
            logger.debug("Error in heartbeat: {}", e.getMessage());
            // Không ném lỗi ra ngoài để tránh lan truyền lên stack trace
        }
    }

    private void sendToEmitters(List<SseEmitter> emitters, String eventName, Object data, boolean isAuth) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        for (SseEmitter emitter : emitters) {
            if (emitter == null) {
                deadEmitters.add(emitter);
                continue;
            }
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data)
                        .id(String.valueOf(System.currentTimeMillis()))
                        .reconnectTime(5000));
            } catch (IOException e) {
                logger.debug("Client disconnected while sending {} to {} emitter: {}", 
                        eventName, isAuth ? "auth" : "admin", e.getMessage());
                deadEmitters.add(emitter);
                completeEmitter(emitter);
            } catch (IllegalStateException e) {
                logger.debug("Emitter completed or timed out while sending {} to {}: {}", 
                        eventName, isAuth ? "auth" : "admin", e.getMessage());
                deadEmitters.add(emitter);
                completeEmitter(emitter);
            } catch (Exception e) {
                logger.debug("Unexpected error while sending {} to {} emitter: {}", 
                        eventName, isAuth ? "auth" : "admin", e.getMessage());
                deadEmitters.add(emitter);
                completeEmitter(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            logger.debug("Removed {} dead {} emitters", deadEmitters.size(), isAuth ? "auth" : "admin");
        }
    }

    private void cleanDeadEmitters(List<SseEmitter> emitters, boolean isAuth) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            if (emitter == null) {
                deadEmitters.add(emitter);
                continue;
            }
            try {
                emitter.send(SseEmitter.event().comment("test"));
            } catch (IOException e) {
                logger.debug("Cleaned inactive {} emitter due to disconnection: {}", 
                        isAuth ? "auth" : "admin", e.getMessage());
                deadEmitters.add(emitter);
                completeEmitter(emitter);
            } catch (IllegalStateException e) {
                logger.debug("Cleaned timed out {} emitter: {}", 
                        isAuth ? "auth" : "admin", e.getMessage());
                deadEmitters.add(emitter);
                completeEmitter(emitter);
            }
        }
        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            logger.debug("Cleaned {} dead/inactive {} emitters", deadEmitters.size(), isAuth ? "auth" : "admin");
        }
    }

    private void completeEmitter(SseEmitter emitter) {
        if (emitter != null) {
            try {
                emitter.complete();
            } catch (Exception e) {
                logger.debug("Failed to complete emitter: {}", e.getMessage());
            }
        }
    }

    private void completeAllEmitters(List<SseEmitter> emitters, String type) {
        emitters.forEach(this::completeEmitter);
        emitters.clear();
        logger.debug("Completed all {} emitters", type);
    }

    public void notifyAuthActivity(Object data) {
        sendToEmitters(authEmitters, "AUTH_ACTIVITY", data, true);
    }

    public void notifyAdminActivity(Object data) {
        sendToEmitters(adminEmitters, "ADMIN_ACTIVITY", data, false);
    }

    public int getAuthEmitterCount() {
        return authEmitters.size();
    }

    public int getAdminEmitterCount() {
        return adminEmitters.size();
    }

    public void removeEmittersForUser(String userId) {
        List<SseEmitter> toRemoveAuth = new ArrayList<>(authEmitters);
        List<SseEmitter> toRemoveAdmin = new ArrayList<>(adminEmitters);

        toRemoveAuth.forEach(this::completeEmitter);
        toRemoveAdmin.forEach(this::completeEmitter);

        authEmitters.removeAll(toRemoveAuth);
        adminEmitters.removeAll(toRemoveAdmin);

        logger.info("Cleaned up {} auth and {} admin emitters for user {}",
                toRemoveAuth.size(), toRemoveAdmin.size(), userId);
    }
}