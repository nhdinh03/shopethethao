package com.shopethethao.modules.product_Attributes;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.userHistory.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/productattributes")
public class ProductAttributesAPI {

    private static final Logger logger = LoggerFactory.getLogger(ProductAttributesAPI.class);

    @Autowired
    private ProductAttributesDAO productAttributesDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<ProductAttributes>> findAll() {
        List<ProductAttributes> productsDistinctives = productAttributesDAO.findAll();
        return ResponseEntity.ok(productsDistinctives);
    }

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<ProductAttributes> page = productAttributesDAO.findAll(pageable);
            ResponseDTO<ProductAttributes> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ Lấy chi tiết một thuộc tính theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductAttributes> getAttributeById(@PathVariable Integer id) {
        Optional<ProductAttributes> attribute = productAttributesDAO.findById(id);
        return attribute.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Autowired
    private UserHistoryService userHistoryService;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() ? authentication.getName() : null;
    }

    // ✅ Thêm một thuộc tính mới
    @PostMapping
    public ResponseEntity<?> addAttribute(
            @RequestBody ProductAttributes attribute,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // Validate name
            if (attribute.getName() == null || attribute.getName().trim().isEmpty()) {
                String errorMessage = "Tên thuộc tính không được để trống!";
                logAdminAction(authentication.getName(), request, "THÊM THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            }

            // Normalize the name
            attribute.setName(attribute.getName().trim());

            // Check for duplicate
            Optional<ProductAttributes> existing = productAttributesDAO.findByNameIgnoreCase(attribute.getName());
            if (existing.isPresent()) {
                String errorMessage = String.format("Thuộc tính '%s' đã tồn tại!", attribute.getName());
                logAdminAction(authentication.getName(), request, "THÊM THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
            }

            ProductAttributes savedAttribute = productAttributesDAO.save(attribute);

            // Create detailed log message
            String logMessage = String.format("""
                    ADMIN: %s đã thêm thuộc tính mới
                    Chi tiết:
                    - Tên thuộc tính: %s""",
                    authentication.getName(),
                    savedAttribute.getName());

            userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.CREATE_PRODUCTATTRIBUTES,
                    logMessage,
                    getClientIp(request),
                    request.getHeader("User-Agent"));

            return ResponseEntity.ok(savedAttribute);
        } catch (Exception e) {
            logger.error("Error creating product attribute", e);
            return ResponseEntity.badRequest().body("Không thể tạo thuộc tính: " + e.getMessage());
        }
    }

    // ✅ Cập nhật thuộc tính
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttribute(
            @PathVariable Integer id,
            @RequestBody ProductAttributes newAttribute,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<ProductAttributes> optionalAttribute = productAttributesDAO.findById(id);
            if (optionalAttribute.isEmpty()) {
                String errorMessage = String.format("Thuộc tính #%d không tồn tại!", id);
                logAdminAction(authentication.getName(), request, "CẬP NHẬT THẤT BẠI: " + errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            ProductAttributes existingAttribute = optionalAttribute.get();
            List<String> changes = new ArrayList<>();
            LocalDateTime updateTime = LocalDateTime.now();

            // Track name changes
            if (!existingAttribute.getName().equals(newAttribute.getName())) {
                changes.add(String.format("- Tên thuộc tính:%n  + Cũ: '%s'%n  + Mới: '%s'",
                        existingAttribute.getName(),
                        newAttribute.getName()));
                existingAttribute.setName(newAttribute.getName());
            }

            if (!changes.isEmpty()) {
                ProductAttributes updatedAttribute = productAttributesDAO.save(existingAttribute);

                String changeLog = String.format("""
                        ADMIN: %s đã cập nhật thuộc tính #%d%n
                        Chi tiết thay đổi:%n
                        %s""",
                        authentication.getName(),
                        id,
                        String.join(System.lineSeparator(), changes));

                userHistoryService.logUserAction(
                        authentication.getName(),
                        UserActionType.UPDATE_PRODUCTATTRIBUTES,
                        changeLog,
                        getClientIp(request),
                        request.getHeader("User-Agent"));

                Map<String, Object> response = new HashMap<>();
                response.put("attribute", updatedAttribute);
                response.put("changes", changes);
                response.put("updateTime", updateTime);
                response.put("updatedBy", authentication.getName());

                return ResponseEntity.ok(response);
            } else {
                String message = String.format("Không có thay đổi nào được thực hiện cho thuộc tính #%d", id);
                logAdminAction(authentication.getName(), request, message);
                return new ResponseEntity<>(message, HttpStatus.OK);
            }
        } catch (Exception e) {
            logger.error("Error updating product attribute", e);
            return ResponseEntity.badRequest().body("Không thể cập nhật thuộc tính: " + e.getMessage());
        }
    }

    // ✅ Xóa một thuộc tính
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttribute(
            @PathVariable Integer id,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            return productAttributesDAO.findById(id)
                    .map(attribute -> {
                        String attributeName = attribute.getName();
                        productAttributesDAO.deleteById(id);

                        // Create detailed log message
                        String logMessage = String.format("""
                                ADMIN: %s đã xóa thuộc tính
                                Chi tiết:
                                - ID: %d
                                - Tên thuộc tính: %s""",
                                authentication.getName(),
                                id,
                                attributeName);

                        userHistoryService.logUserAction(
                                authentication.getName(),
                                UserActionType.DELETE_PRODUCTATTRIBUTES,
                                logMessage,
                                getClientIp(request),
                                request.getHeader("User-Agent"));

                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "Xóa thuộc tính thành công");
                        response.put("deletedBy", authentication.getName());
                        response.put("deletedAt", LocalDateTime.now());
                        response.put("attributeInfo", Map.of(
                                "id", id,
                                "name", attributeName));

                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error deleting product attribute", e);
            return ResponseEntity.badRequest()
                    .body("Không thể xóa thuộc tính: " + e.getMessage());
        }
    }

    // Helper methods
    private void logAdminAction(String adminUsername, HttpServletRequest request, String action) {
        try {
            UserActionType actionType = determineActionType(action);
            userHistoryService.logUserAction(
                    adminUsername,
                    actionType,
                    action,
                    getClientIp(request),
                    request.getHeader("User-Agent"));
        } catch (Exception e) {
            logger.error("Failed to log admin action: {}", e.getMessage());
        }
    }

    private UserActionType determineActionType(String action) {
        if (action.startsWith("CẬP NHẬT")) {
            return UserActionType.UPDATE_PRODUCTATTRIBUTES;
        } else if (action.startsWith("XÓA")) {
            return UserActionType.DELETE_PRODUCTATTRIBUTES;
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
}
