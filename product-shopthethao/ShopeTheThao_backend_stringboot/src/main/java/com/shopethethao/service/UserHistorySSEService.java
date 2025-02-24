package com.shopethethao.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
@Service
public class UserHistorySSEService {
    private final CopyOnWriteArrayList<SseEmitter> authEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();

    public SseEmitter createAuthEmitter() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        this.authEmitters.add(emitter);
        
        emitter.onCompletion(() -> this.authEmitters.remove(emitter));
        emitter.onTimeout(() -> this.authEmitters.remove(emitter));
        
        return emitter;
    }

    public SseEmitter createAdminEmitter() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        this.adminEmitters.add(emitter);
        
        emitter.onCompletion(() -> this.adminEmitters.remove(emitter));
        emitter.onTimeout(() -> this.adminEmitters.remove(emitter));
        
        return emitter;
    }

    public void notifyAuthActivity(Object data) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        authEmitters.forEach(emitter -> {
            try {
                emitter.send(data);
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });

        authEmitters.removeAll(deadEmitters);
    }

    public void notifyAdminActivity(Object data) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        adminEmitters.forEach(emitter -> {
            try {
                emitter.send(data);
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });

        adminEmitters.removeAll(deadEmitters);
    }
}
