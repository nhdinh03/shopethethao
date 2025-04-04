package com.shopethethao.modules.size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.service.AdminLogService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/size")
public class SizeAPI {

    @Autowired
    private SizeDAO sizeDAO;

    @Autowired
    private AdminLogService adminLogService;

    // Fetch all sizes
    @GetMapping("/get/all")
    public ResponseEntity<List<Size>> findAll() {
        List<Size> sizes = sizeDAO.findAll();
        return ResponseEntity.ok(sizes);
    }

    // Fetch sizes with pagination and search functionality
    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam(value = "search", required = false) String search) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Page not found", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Size> page;

            if (search != null && !search.trim().isEmpty()) {
                // Search by name or description containing the search term (case-insensitive)
                page = sizeDAO.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        search.trim(), search.trim(), pageable);
            } else {
                page = sizeDAO.findAll(pageable);
            }

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
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "THÊM THẤT BẠI: " + errorMessage,
                    "SIZE");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            }

            // Normalize the size name
            size.setName(size.getName().trim());

            // Check for duplicate size name
            Optional<Size> existingSize = sizeDAO.findByName(size.getName());
            if (existingSize.isPresent()) {
                String errorMessage = String.format("Size '%s' đã tồn tại!", size.getName());
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "THÊM THẤT BẠI: " + errorMessage,
                    "SIZE");
                return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
            }

            Size savedSize = sizeDAO.save(size);

            // Create detailed log message
            String logMessage = String.format("""
                Thêm kích thước - %s
                Chi tiết:
                - Mã: %d
                - Tên kích thước: %s
                - Mô tả: %s""",
                    authentication.getName(),
                    savedSize.getId(),
                    savedSize.getName(),
                    savedSize.getDescription() != null ? savedSize.getDescription() : "Không có"
            );

            // Log user action
            adminLogService.logAdminAction(
                authentication.getName(),
                request,
                logMessage,
                "SIZE");

            // Return success response with details
            Map<String, Object> response = new HashMap<>();
            response.put("size", savedSize);
            response.put("message", String.format("ADMIN: %s đã tạo size mới thành công!", authentication.getName()));
            response.put("createdBy", authentication.getName());
            response.put("createdAt", LocalDateTime.now());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMessage = "Không thể thêm size: " + e.getMessage();
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "SIZE");
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
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "CẬP NHẬT THẤT BẠI: " + errorMessage,
                    "SIZE");
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            // Check for duplicate size name
            Optional<Size> duplicateSize = sizeDAO.findByName(size.getName());
            if (duplicateSize.isPresent() && !duplicateSize.get().getId().equals(id)) {
                String errorMessage = String.format("Size '%s' đã tồn tại!", size.getName());
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "CẬP NHẬT THẤT BẠI: " + errorMessage,
                    "SIZE");
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
                    Cập nhật kích thước - %s
                    Chi tiết thay đổi:
                    %s""",
                        authentication.getName(),
                        String.join(System.lineSeparator(), changes));

                // Log the admin action
                adminLogService.logAdminAction(
                    authentication.getName(),
                    request,
                    changeLog,
                    "SIZE");

                // Return success response with details
                Map<String, Object> response = new HashMap<>();
                response.put("size", updatedSize);
                response.put("changes", changes);
                response.put("updateTime", updateTime);
                response.put("updatedBy", authentication.getName());

                return ResponseEntity.ok(response);
            } else {
                String message = String.format("Không có thay đổi nào được thực hiện cho size #%d", id);
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    message,
                    "SIZE");
                return new ResponseEntity<>(message, HttpStatus.OK);
            }

        } catch (Exception e) {
            String errorMessage = String.format("Lỗi khi cập nhật size #%d: %s", id, e.getMessage());
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "SIZE");
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
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "XÓA THẤT BẠI: " + errorMessage,
                    "SIZE");
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            Size size = sizeToDelete.get();

            // Create detailed log message before deletion
            String logMessage = String.format("""
                Xóa kích thước - %s
                Chi tiết:
                - Mã: %d
                - Tên kích thước: %s
                - Mô tả: %s""",
                    authentication.getName(),
                    id,
                    size.getName(),
                    size.getDescription() != null ? size.getDescription() : "Không có"
            );

            // Thực hiện xóa
            sizeDAO.deleteById(id);

            // Log user action
            adminLogService.logAdminAction(
                authentication.getName(),
                request,
                logMessage,
                "SIZE");

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
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "SIZE");
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
