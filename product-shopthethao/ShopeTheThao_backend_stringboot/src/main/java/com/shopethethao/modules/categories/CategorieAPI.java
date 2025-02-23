package com.shopethethao.modules.categories;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
import com.shopethethao.modules.products.ProductsDAO;
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.userHistory.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/categories")
public class CategorieAPI {

    @Autowired
    private CategorieDAO dao;

    @Autowired
    private ProductsDAO productsDAO;

    @Autowired
    private UserHistoryService userHistoryService;

    private static final Logger logger = LoggerFactory.getLogger(CategorieAPI.class);

    
    // Lấy toàn bộ danh mục (không phân trang)
    @GetMapping("/get/all")
    public ResponseEntity<List<Categorie>> findAll() {
        List<Categorie> categories = dao.findAll();
        return ResponseEntity.ok(categories);
    }

    // Lấy danh sách danh mục có phân trang
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Categorie> page = dao.findAll(pageable);
            ResponseDTO<Categorie> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // **Thêm mới danh mục**
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Categorie category,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // Validate required fields
            if (category.getName() == null || category.getName().trim().isEmpty()) {
                return new ResponseEntity<>("Tên danh mục không được để trống!", HttpStatus.BAD_REQUEST);
            }

            // Normalize the category name (trim whitespace)
            category.setName(category.getName().trim());

            // Check for duplicate category name (case insensitive)
            Optional<Categorie> existingCategory = dao.findByNameIgnoreCase(category.getName());
            if (existingCategory.isPresent()) {
                return new ResponseEntity<>("Tên danh mục đã tồn tại!", HttpStatus.CONFLICT);
            }

            Categorie savedCategory = dao.save(category);

            // Create detailed log message with admin info
            String logMessage = String.format("""
                ADMIN: %s đã thêm danh mục mới
                Chi tiết:
                - Tên danh mục: %s
                - Mô tả: %s""",
                authentication.getName(),
                savedCategory.getName(),
                savedCategory.getDescription() != null ? savedCategory.getDescription() : "Không có"
            );

            // Log user action
            userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.CREATE_CATEGORIE,
                    logMessage,
                    getClientIp(request),
                    getClientInfo(request));

            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể thêm danh mục: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer id,
            @RequestBody Categorie categorie,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Categorie> optionalCategory = dao.findById(id);
            if (optionalCategory.isEmpty()) {
                String errorMessage = String.format("Danh mục #%d không tồn tại!", id);
                logAdminAction(authentication.getName(), request,
                        "CẬP NHẬT THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            // Kiểm tra và log trùng tên
            Optional<Categorie> duplicateCategory = dao.findByName(categorie.getName());
            if (duplicateCategory.isPresent() && !duplicateCategory.get().getId().equals(id)) {
                String errorMessage = String.format("Tên danh mục '%s' đã tồn tại!", categorie.getName());
                logAdminAction(authentication.getName(), request,
                        "CẬP NHẬT THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
            }

            Categorie existingCategory = optionalCategory.get();
            List<String> changes = new ArrayList<>();
            LocalDateTime updateTime = LocalDateTime.now();

            // Track name changes with detailed formatting
            if (!existingCategory.getName().equals(categorie.getName())) {
                changes.add(String.format("- Tên danh mục:%n  + Cũ: '%s'%n  + Mới: '%s'",
                        existingCategory.getName(),
                        categorie.getName()));
                existingCategory.setName(categorie.getName());
            }

            // Track description changes with detailed formatting
            if (!Objects.equals(existingCategory.getDescription(), categorie.getDescription())) {
                changes.add(String.format("- Mô tả:%n  + Cũ: '%s'%n  + Mới: '%s'",
                        existingCategory.getDescription() != null ? existingCategory.getDescription() : "Không có",
                        categorie.getDescription() != null ? categorie.getDescription() : "Không có"));
                existingCategory.setDescription(categorie.getDescription());
            }

            // If there are changes, save and create detailed log
            if (!changes.isEmpty()) {
                Categorie updatedCategory = dao.save(existingCategory);

                // Create detailed change log
                String changeLog = String.format("""
                        ADMIN: %s đã cập nhật danh mục #%d%n
                        Chi tiết thay đổi:%n
                        %s""",
                        authentication.getName(),
                        id,
                        String.join(System.lineSeparator(), changes));

                // Log the admin action
                userHistoryService.logUserAction(
                        authentication.getName(),
                        UserActionType.UPDATE_CATEGORIE,
                        changeLog,
                        getClientIp(request),
                        getClientInfo(request));

                // Return success response with details
                Map<String, Object> response = new HashMap<>();
                response.put("category", updatedCategory);
                response.put("changes", changes);
                response.put("updateTime", updateTime);
                response.put("updatedBy", authentication.getName());

                return ResponseEntity.ok(response);
            } else {
                String message = String.format("Không có thay đổi nào được thực hiện cho danh mục #%d", id);
                logAdminAction(authentication.getName(), request, message);
                return new ResponseEntity<>(message, HttpStatus.OK);
            }

        } catch (Exception e) {
            String errorMessage = String.format("Lỗi khi cập nhật danh mục #%d: %s", id, e.getMessage());
            logAdminAction(authentication.getName(), request, "LỖI: " + errorMessage);
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer id,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // 🔥 Kiểm tra xem danh mục có tồn tại không
            Optional<Categorie> categoryToDelete = dao.findById(id);
            if (categoryToDelete.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Danh mục không tồn tại!");
            }

            // 🔥 Kiểm tra xem danh mục có sản phẩm liên quan không
            if (productsDAO.existsByCategorieId(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Không thể xóa danh mục vì có sản phẩm liên quan!");
            }

            String categoryName = categoryToDelete.get().getName();
            
            // ✅ Xóa danh mục nếu không có sản phẩm liên quan
            dao.deleteById(id);

            // Create detailed log message
            String logMessage = String.format("""
                ADMIN: %s đã xóa danh mục
                Chi tiết:
                - ID: %d
                - Tên danh mục: %s""",
                authentication.getName(),
                id,
                categoryName
            );

            // Log user action
            userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.DELETE_CATEGORIE,
                    logMessage,
                    getClientIp(request),
                    getClientInfo(request));

            return ResponseEntity.ok(String.format("ADMIN: %s đã xóa danh mục '%s' thành công!", 
                authentication.getName(), categoryName));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa danh mục do dữ liệu tham chiếu!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi không xác định khi xóa danh mục!");
        }
    }

    private void logAdminAction(String adminUsername, HttpServletRequest request, String action) {
        try {
            // Determine the action type using a more readable approach
            UserActionType actionType = determineActionType(action);
    
            userHistoryService.logUserAction(
                    adminUsername,
                    actionType,
                    action,
                    getClientIp(request),
                    getClientInfo(request));
        } catch (Exception e) {
            logger.error("Failed to log admin action: {}", e.getMessage());
        }
    }
    
    private UserActionType determineActionType(String action) {
        if (action.startsWith("CẬP NHẬT")) {
            return UserActionType.UPDATE_CATEGORIE;
        } else if (action.startsWith("XÓA")) {
            return UserActionType.DELETE_CATEGORIE;
        } else {
            return UserActionType.ADMIN_ACTION;
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
