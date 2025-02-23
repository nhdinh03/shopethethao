package com.shopethethao.modules.size;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.userHistory.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/size")
public class SizeAPI {

    @Autowired
    private SizeDAO sizeDAO;

    @Autowired
    private UserHistoryService userHistoryService;

    // Fetch all sizes
    @GetMapping("/get/all")
    public ResponseEntity<List<Size>> findAll() {
        List<Size> sizes = sizeDAO.findAll();
        return ResponseEntity.ok(sizes);
    }

    // Fetch sizes with pagination
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
                                     @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Page not found", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Size> page = sizeDAO.findAll(pageable);

            ResponseDTO<Size> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, please try again later!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new size
    @PostMapping
    public ResponseEntity<?> addSize(
            @RequestBody Size size,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // Validate required fields
            if (size.getName() == null || size.getName().trim().isEmpty()) {
                String errorMessage = "Tên size không được để trống!";
                logAdminAction(authentication.getName(), request, "TẠO MỚI THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            }

            // Normalize the size name
            size.setName(size.getName().trim());

            // Check for duplicate size name
            Optional<Size> existingSize = sizeDAO.findByName(size.getName());
            if (existingSize.isPresent()) {
                String errorMessage = String.format("Size '%s' đã tồn tại!", size.getName());
                logAdminAction(authentication.getName(), request, "TẠO MỚI THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
            }

            Size savedSize = sizeDAO.save(size);

            // Create detailed log message
            String logMessage = String.format("""
                ADMIN: %s đã tạo size mới
                Chi tiết:
                - ID: %d
                - Tên size: %s
                - Mô tả: %s""",
                authentication.getName(),
                savedSize.getId(),
                savedSize.getName(),
                savedSize.getDescription() != null ? savedSize.getDescription() : "Không có"
            );

            // Log user action
            userHistoryService.logUserAction(
                authentication.getName(),
                UserActionType.CREATE_SIZE,
                logMessage,
                getClientIp(request),
                getClientInfo(request)
            );

            // Return success response with details
            Map<String, Object> response = new HashMap<>();
            response.put("size", savedSize);
            response.put("message", String.format("ADMIN: %s đã tạo size mới thành công!", authentication.getName()));
            response.put("createdBy", authentication.getName());
            response.put("createdAt", LocalDateTime.now());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMessage = "Không thể thêm size: " + e.getMessage();
            logAdminAction(authentication.getName(), request, "LỖI: " + errorMessage);
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    // Edit an existing size
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSize(
            @PathVariable("id") Integer id, 
            @RequestBody Size size,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Size> optionalSize = sizeDAO.findById(id);
            if (optionalSize.isEmpty()) {
                String errorMessage = String.format("Size #%d không tồn tại!", id);
                logAdminAction(authentication.getName(), request, 
                    "CẬP NHẬT THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            // Check for duplicate size name
            Optional<Size> duplicateSize = sizeDAO.findByName(size.getName());
            if (duplicateSize.isPresent() && !duplicateSize.get().getId().equals(id)) {
                String errorMessage = String.format("Size '%s' đã tồn tại!", size.getName());
                logAdminAction(authentication.getName(), request, 
                    "CẬP NHẬT THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
            }

            Size existingSize = optionalSize.get();
            List<String> changes = new ArrayList<>();
            LocalDateTime updateTime = LocalDateTime.now();

            // Track name changes
            if (!existingSize.getName().equals(size.getName())) {
                changes.add(String.format("- Tên size:%n  + Cũ: '%s'%n  + Mới: '%s'",
                    existingSize.getName(),
                    size.getName()));
                existingSize.setName(size.getName());
            }

            // Track description changes
            if (!Objects.equals(existingSize.getDescription(), size.getDescription())) {
                changes.add(String.format("- Mô tả:%n  + Cũ: '%s'%n  + Mới: '%s'",
                    existingSize.getDescription() != null ? existingSize.getDescription() : "Không có",
                    size.getDescription() != null ? size.getDescription() : "Không có"));
                existingSize.setDescription(size.getDescription());
            }

            // If there are changes, save and create detailed log
            if (!changes.isEmpty()) {
                Size updatedSize = sizeDAO.save(existingSize);

                // Create detailed change log
                String changeLog = String.format("""
                    ADMIN: %s đã cập nhật size #%d
                    Chi tiết thay đổi:
                    %s""",
                    authentication.getName(),
                    id,
                    String.join(System.lineSeparator(), changes));

                // Log the admin action
                userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.UPDATE_SIZE,
                    changeLog,
                    getClientIp(request),
                    getClientInfo(request));

                // Return success response with details
                Map<String, Object> response = new HashMap<>();
                response.put("size", updatedSize);
                response.put("changes", changes);
                response.put("updateTime", updateTime);
                response.put("updatedBy", authentication.getName());

                return ResponseEntity.ok(response);
            } else {
                String message = String.format("Không có thay đổi nào được thực hiện cho size #%d", id);
                logAdminAction(authentication.getName(), request, message);
                return new ResponseEntity<>(message, HttpStatus.OK);
            }

        } catch (Exception e) {
            String errorMessage = String.format("Lỗi khi cập nhật size #%d: %s", id, e.getMessage());
            logAdminAction(authentication.getName(), request, "LỖI: " + errorMessage);
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a size
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSize(
            @PathVariable("id") Integer id,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // Kiểm tra size tồn tại
            Optional<Size> sizeToDelete = sizeDAO.findById(id);
            if (sizeToDelete.isEmpty()) {
                String errorMessage = String.format("Size #%d không tồn tại!", id);
                logAdminAction(authentication.getName(), request, "XÓA THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            Size size = sizeToDelete.get();

            // Create detailed log message before deletion
            String logMessage = String.format("""
                ADMIN: %s đã xóa size
                Chi tiết size đã xóa:
                - ID: %d
                - Tên size: %s
                - Mô tả: %s""",
                authentication.getName(),
                id,
                size.getName(),
                size.getDescription() != null ? size.getDescription() : "Không có"
            );

            // Thực hiện xóa
            sizeDAO.deleteById(id);

            // Log user action
            userHistoryService.logUserAction(
                authentication.getName(),
                UserActionType.DELETE_SIZE,
                logMessage,
                getClientIp(request),
                getClientInfo(request)
            );

            // Return success response with details
            Map<String, Object> response = new HashMap<>();
            response.put("message", String.format("ADMIN: %s đã xóa size '%s' thành công!", 
                authentication.getName(), size.getName()));
            response.put("deletedBy", authentication.getName());
            response.put("deletedAt", LocalDateTime.now());
            response.put("sizeInfo", size);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            String errorMessage = "Lỗi khi xóa size: " + e.getMessage();
            logAdminAction(authentication.getName(), request, "LỖI: " + errorMessage);
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper method to get current user ID
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    // Add these helper methods if they don't exist
    private void logAdminAction(String adminUsername, HttpServletRequest request, String action) {
        try {
            UserActionType actionType = action.startsWith("CẬP NHẬT") ? 
                UserActionType.UPDATE_SIZE : UserActionType.ADMIN_ACTION;

            userHistoryService.logUserAction(
                adminUsername,
                actionType,
                action,
                getClientIp(request),
                getClientInfo(request)
            );
        } catch (Exception e) {
            // Log error if needed
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private String getClientInfo(HttpServletRequest request) {
        return request.getHeader("User-Agent");
    }
}
