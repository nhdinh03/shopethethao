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
import com.shopethethao.modules.brands.Brand;
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.userHistory.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/productattributes")
public class ProductAttributesAPI {

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
        HttpServletRequest request
    ) {
        try {
            // Validate
            if (attribute.getName() == null || attribute.getName().trim().isEmpty()) {
                return new ResponseEntity<>("Tên thuộc tính không được để trống!", HttpStatus.BAD_REQUEST);
            }

            ProductAttributes savedAttribute = productAttributesDAO.save(attribute);
            String userId = getCurrentUserId();
            
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.CREATE_PRODUCTATTRIBUTES,
                    "Tạo thuộc tính mới tên: " + savedAttribute.getName(),
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent")
                );
            }

            return ResponseEntity.ok(savedAttribute);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể tạo thuộc tính: " + e.getMessage());
        }
    }

    // ✅ Cập nhật thuộc tính
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttribute(
        @PathVariable Integer id,
        @RequestBody ProductAttributes newAttribute,
        HttpServletRequest request
    ) {
        try {
            return productAttributesDAO.findById(id)
                .map(existingAttribute -> {
                    String oldName = existingAttribute.getName();
                    existingAttribute.setName(newAttribute.getName());
                    ProductAttributes updatedAttribute = productAttributesDAO.save(existingAttribute);

                    String userId = getCurrentUserId();
                    if (userId != null) {
                        userHistoryService.logUserAction(
                            userId,
                            UserActionType.UPDATE_PRODUCTATTRIBUTES,
                            String.format("Cập nhật thuộc tính từ '%s' thành '%s'", oldName, updatedAttribute.getName()),
                            request.getRemoteAddr(),
                            request.getHeader("User-Agent")
                        );
                    }

                    return ResponseEntity.ok(updatedAttribute);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể cập nhật thuộc tính: " + e.getMessage());
        }
    }

    // ✅ Xóa một thuộc tính
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttribute(
        @PathVariable Integer id,
        HttpServletRequest request
    ) {
        try {
            return productAttributesDAO.findById(id)
                .map(attribute -> {
                    String attributeName = attribute.getName();
                    productAttributesDAO.deleteById(id);

                    String userId = getCurrentUserId();
                    if (userId != null) {
                        userHistoryService.logUserAction(
                            userId,
                            UserActionType.DELETE_PRODUCTATTRIBUTES,
                            "Xóa thuộc tính: " + attributeName,
                            request.getRemoteAddr(),
                            request.getHeader("User-Agent")
                        );
                    }

                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa thuộc tính: " + e.getMessage());
        }
    }
}
