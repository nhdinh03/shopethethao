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

    // Danh sách trình phát SSE cho người dùng xác thực và quản trị viên Quản lý kết
    // nối:
    private final CopyOnWriteArrayList<SseEmitter> authEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();
    private final ScheduledExecutorService heartbeatExecutor = Executors.newSingleThreadScheduledExecutor();

    // Thời gian timeout cho emitter (24 giờ)
    private static final long TIMEOUT = 24 * 60 * 60 * 1000L;
    // Thời gian giữa các lần gửi heartbeat (10 giây)
    private static final long HEARTBEAT_DELAY = 10;

    public UserHistorySSEService() {
        heartbeatExecutor.scheduleAtFixedRate(this::sendHeartbeat, 0, HEARTBEAT_DELAY, TimeUnit.SECONDS);
    }

    public SseEmitter createAuthEmitter() {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        this.authEmitters.add(emitter);

        emitter.onCompletion(() -> {
            this.authEmitters.remove(emitter);
            logger.debug("Trình phát xác thực đã hoàn tất và bị xóa, còn lại: {}", authEmitters.size());
        });

        emitter.onTimeout(() -> {
            this.authEmitters.remove(emitter);
            logger.info("Trình phát xác thực đã hết thời gian chờ, máy khách sẽ tự động kết nối lại");
            // Client sẽ thực hiện reconnect với retry strategy
        });

        emitter.onError((e) -> {
            this.authEmitters.remove(emitter);
            logger.error("Lỗi trình phát xác thực: {}", e.getMessage());
            // Thêm logic để thử kết nối lại
            attemptReconnection(emitter, true);
        });

        try {
            // Gửi thông tin retry cho client
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("Đã thiết lập kết nối")
                    .reconnectTime(3000)); // Reconnect sau 3 giây nếu mất kết nối
        } catch (IOException e) {
            logger.error("Lỗi trong quá trình khởi tạo trình phát xác thựcn", e);
            attemptReconnection(emitter, true);
        }

        return emitter;
    }

    public SseEmitter createAdminEmitter() {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        this.adminEmitters.add(emitter);

        // Tương tự như auth emitter
        emitter.onCompletion(() -> {
            this.adminEmitters.remove(emitter);
            logger.debug("Trình phát của quản trị viên đã hoàn tất và bị xóa, còn lại: {}", adminEmitters.size());
        });

        emitter.onTimeout(() -> {
            this.adminEmitters.remove(emitter);
            logger.info("Trình phát của quản trị viên đã hết thời gian chờ, máy khách sẽ tự động kết nối lại");
        });

        emitter.onError((e) -> {
            this.adminEmitters.remove(emitter);
            logger.error("Lỗi trình phát của quản trị viên: {}", e.getMessage());
            attemptReconnection(emitter, false);
        });

        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("Đã thiết lập kết nối")
                    .reconnectTime(3000));
        } catch (IOException e) {
            logger.error("Lỗi trong quá trình khởi tạo trình phát của quản trị viên", e);
            attemptReconnection(emitter, false);
        }

        return emitter;
    }

    private void attemptReconnection(SseEmitter emitter, boolean isAuth) {
        try {
            // Tạo emitter mới
            SseEmitter newEmitter = new SseEmitter(TIMEOUT);
            if (isAuth) {
                authEmitters.add(newEmitter);
            } else {
                adminEmitters.add(newEmitter);
            }
            // Thông báo cho client về việc reconnect thành công
            newEmitter.send(SseEmitter.event()
                    .name("RECONNECTED")
                    .data("Kết nối được thiết lập lại")
                    .reconnectTime(3000));
        } catch (IOException e) {
            logger.error("Không kết nối lại được: {}", e.getMessage());
        }
    }

    private void sendHeartbeat() {
        // Gửi tín hiệu định kỳ để giữ kết nối
        List<SseEmitter> deadAuthEmitters = new ArrayList<>();
        List<SseEmitter> deadAdminEmitters = new ArrayList<>();

        // Send heartbeat to auth emitters
        authEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("HEARTBEAT")
                        .data("ping")
                        .id(String.valueOf(System.currentTimeMillis()))
                        .reconnectTime(3000)); // Thêm reconnectTime cho mỗi heartbeat
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
                        .id(String.valueOf(System.currentTimeMillis()))
                        .reconnectTime(3000));
            } catch (IOException e) {
                deadAdminEmitters.add(emitter);
            }
        });

        // Remove dead emitters and attempt reconnection
        deadAuthEmitters.forEach(emitter -> {
            authEmitters.remove(emitter);
            attemptReconnection(emitter, true);
        });

        deadAdminEmitters.forEach(emitter -> {
            adminEmitters.remove(emitter);
            attemptReconnection(emitter, false);
        });
    }

    public void notifyAuthActivity(Object data) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        authEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("AUTH_ACTIVITY")
                        .data(data)
                        .id(String.valueOf(System.currentTimeMillis())));
                logger.debug("Đã gửi bản cập nhật hoạt động xác thực tới emiter");
            } catch (IOException e) {
                logger.error("Không gửi được bản cập nhật hoạt động xác thực: {}", e.getMessage());
                deadEmitters.add(emitter);
            }
        });

        if (!deadEmitters.isEmpty()) {
            logger.debug("Đang xóa {} trình phát xác thực đã chết", deadEmitters.size());
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
                logger.debug("Đã gửi bản cập nhật hoạt động của quản trị viên tới bộ phát");
            } catch (IOException e) {
                logger.error("Không gửi được thông tin cập nhật hoạt động của quản trị viên: {}", e.getMessage());
                deadEmitters.add(emitter);
            }
        });

        if (!deadEmitters.isEmpty()) {
            logger.debug("Đang xóa {} trình phát của quản trị viên đã chết", deadEmitters.size());
            adminEmitters.removeAll(deadEmitters);
        }
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

        // Just mark emitters for removal without trying to send final messages
        authEmitters.forEach(emitter -> {
            try {
                emitter.complete(); // Complete the emitter properly
                toRemoveAuth.add(emitter);
            } catch (Exception e) {
                logger.debug("Error completing auth emitter: {}", e.getMessage());
                toRemoveAuth.add(emitter);
            }
        });

        adminEmitters.forEach(emitter -> {
            try {
                emitter.complete(); // Complete the emitter properly
                toRemoveAdmin.add(emitter);
            } catch (Exception e) {
                logger.debug("Error completing admin emitter: {}", e.getMessage());
                toRemoveAdmin.add(emitter);
            }
        });

        // Remove all marked emitters
        if (!toRemoveAuth.isEmpty()) {
            authEmitters.removeAll(toRemoveAuth);
            logger.debug("Removed {} auth emitters", toRemoveAuth.size());
        }

        if (!toRemoveAdmin.isEmpty()) {
            adminEmitters.removeAll(toRemoveAdmin);
            logger.debug("Removed {} admin emitters", toRemoveAdmin.size());
        }

        logger.info("Cleaned up SSE emitters for user {}", userId);
    }
}
