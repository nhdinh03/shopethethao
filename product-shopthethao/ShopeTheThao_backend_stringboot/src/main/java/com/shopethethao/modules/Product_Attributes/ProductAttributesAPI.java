package com.shopethethao.modules.product_Attributes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.shopethethao.service.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/productattributes")
public class ProductAttributesAPI {

    private static final Logger logger = LoggerFactory.getLogger(ProductAttributesAPI.class);

    @Autowired
    private ProductAttributesDAO productAttributesDAO;

    @Autowired
    private UserHistoryService userHistoryService;

    @Autowired
    private AdminLogService adminLogService;

    @GetMapping("/get/all")
    public ResponseEntity<List<ProductAttributes>> findAll() {
        List<ProductAttributes> productsDistinctives = productAttributesDAO.findAll();
        return ResponseEntity.ok(productsDistinctives);
    }

    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("search") Optional<String> search) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            
            Page<ProductAttributes> page;
            if (search.isPresent() && !search.get().trim().isEmpty()) {
                page = productAttributesDAO.searchByName(search.get().trim(), pageable);
            } else {
                page = productAttributesDAO.findAll(pageable);
            }
            
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
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "THÊM THẤT BẠI: " + errorMessage,
                    "PRODUCTATTRIBUTES");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            }

            // Normalize the name
            attribute.setName(attribute.getName().trim());

            // Check for duplicate
            Optional<ProductAttributes> existing = productAttributesDAO.findByNameIgnoreCase(attribute.getName());
            if (existing.isPresent()) {
                String errorMessage = String.format("Thuộc tính '%s' đã tồn tại!", attribute.getName());
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "THÊM THẤT BẠI: " + errorMessage,
                    "PRODUCTATTRIBUTES");
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

            adminLogService.logAdminAction(
                authentication.getName(),
                request,
                logMessage,
                "PRODUCTATTRIBUTES");

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
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "CẬP NHẬT THẤT BẠI: " + errorMessage,
                    "PRODUCTATTRIBUTES");
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

                adminLogService.logAdminAction(
                    authentication.getName(),
                    request,
                    changeLog,
                    "PRODUCTATTRIBUTES");

                Map<String, Object> response = new HashMap<>();
                response.put("attribute", updatedAttribute);
                response.put("changes", changes);
                response.put("updateTime", updateTime);
                response.put("updatedBy", authentication.getName());

                return ResponseEntity.ok(response);
            } else {
                String message = String.format("Không có thay đổi nào được thực hiện cho thuộc tính #%d", id);
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    message,
                    "PRODUCTATTRIBUTES");
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

                        adminLogService.logAdminAction(
                            authentication.getName(),
                            request,
                            logMessage,
                            "PRODUCTATTRIBUTES");

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


}
