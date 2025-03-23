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

    private static final long TIMEOUT = 60 * 1000L; // 1 phút
    private static final long HEARTBEAT_DELAY = 10; // 10 giây
    private static final int MAX_EMITTERS = 100;

    public UserHistorySSEService() {
        heartbeatExecutor.scheduleAtFixedRate(this::sendHeartbeat, 0, HEARTBEAT_DELAY, TimeUnit.SECONDS);
    }

    @jakarta.annotation.PreDestroy
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
        authEmitters.clear();
        adminEmitters.clear();
    }

    public SseEmitter createAuthEmitter() {
        return createEmitter(authEmitters, true);
    }

    public SseEmitter createAdminEmitter() {
        return createEmitter(adminEmitters, false);
    }

    private SseEmitter createEmitter(CopyOnWriteArrayList<SseEmitter> emitters, boolean isAuth) {
        if (emitters.size() >= MAX_EMITTERS) {
            logger.warn("Max emitters reached ({}), removing oldest emitter", MAX_EMITTERS);
            SseEmitter oldest = emitters.remove(0);
            oldest.complete();
        }

        SseEmitter emitter = new SseEmitter(TIMEOUT);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connection established").reconnectTime(5000));
        } catch (IOException e) {
            // logger.error("Failed to initialize {} emitter", isAuth ? "auth" : "admin", e);
            emitters.remove(emitter);
            emitter.completeWithError(e);
        }
        return emitter;
    }

    private void sendHeartbeat() {
        sendToEmitters(authEmitters, "HEARTBEAT", "ping", true);
        sendToEmitters(adminEmitters, "HEARTBEAT", "ping", false);
    }

    private void sendToEmitters(List<SseEmitter> emitters, String eventName, Object data, boolean isAuth) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                if (emitter != null) {
                    synchronized (emitter) {
                        emitter.send(SseEmitter.event()
                                .name(eventName)
                                .data(data)
                                .id(String.valueOf(System.currentTimeMillis()))
                                .reconnectTime(5000));
                    }
                }
            } catch (IOException e) {
                // deadEmitters.add(emitter);
                // logger.debug("Client disconnected, failed to send {} to {} emitter: {}",
                //         eventName, isAuth ? "auth" : "admin", e.getMessage());
            } catch (IllegalStateException e) {
                // deadEmitters.add(emitter);
                // logger.debug("Emitter already completed or timed out for {}: {}",
                //         isAuth ? "auth" : "admin", e.getMessage());
            } catch (Exception e) {
                // deadEmitters.add(emitter);
                // logger.debug("Unexpected error sending {} to {} emitter: {}",
                //         eventName, isAuth ? "auth" : "admin", e.getMessage());
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            deadEmitters.forEach(emitter -> {
                try {
                    emitter.complete();
                } catch (Exception e) {
                    logger.debug("Failed to complete dead emitter: {}", e.getMessage());
                }
            });
            logger.debug("Removed {} dead {} emitters", deadEmitters.size(), isAuth ? "auth" : "admin");
        }
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
        List<SseEmitter> toRemoveAuth = new ArrayList<>();
        List<SseEmitter> toRemoveAdmin = new ArrayList<>();

        authEmitters.forEach(emitter -> {
            try {
                emitter.complete();
                toRemoveAuth.add(emitter);
            } catch (Exception e) {
                logger.debug("Error completing auth emitter for user {}: {}", userId, e.getMessage());
                toRemoveAuth.add(emitter);
            }
        });

        adminEmitters.forEach(emitter -> {
            try {
                emitter.complete();
                toRemoveAdmin.add(emitter);
            } catch (Exception e) {
                logger.debug("Error completing admin emitter for user {}: {}", userId, e.getMessage());
                toRemoveAdmin.add(emitter);
            }
        });

        if (!toRemoveAuth.isEmpty()) {
            authEmitters.removeAll(toRemoveAuth);
            logger.debug("Removed {} auth emitters for user {}", toRemoveAuth.size(), userId);
        }

        if (!toRemoveAdmin.isEmpty()) {
            adminEmitters.removeAll(toRemoveAdmin);
            logger.debug("Removed {} admin emitters for user {}", toRemoveAdmin.size(), userId);
        }

        logger.info("Cleaned up SSE emitters for user {}", userId);
    }
}