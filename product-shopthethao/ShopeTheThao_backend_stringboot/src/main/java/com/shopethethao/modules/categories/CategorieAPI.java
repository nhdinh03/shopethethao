package com.shopethethao.modules.categories;

import java.util.List;
import java.util.Optional;

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

            // Log user action
            userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.CREATE_CATEGORIE,
                    "Tạo danh mục mới: " + savedCategory.getName(),
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
                return new ResponseEntity<>("Danh mục không tồn tại!", HttpStatus.NOT_FOUND);
            }

            // Kiểm tra trùng tên
            Optional<Categorie> duplicateCategory = dao.findByName(categorie.getName());
            if (duplicateCategory.isPresent() && !duplicateCategory.get().getId().equals(id)) {
                return new ResponseEntity<>("Tên danh mục đã tồn tại!", HttpStatus.CONFLICT);
            }

            Categorie existingCategory = optionalCategory.get();
            StringBuilder changes = new StringBuilder();

            // Track name changes
            if (!existingCategory.getName().equals(categorie.getName())) {
                changes.append(String.format("Tên: '%s' thành '%s', ", 
                    existingCategory.getName(), categorie.getName()));
                existingCategory.setName(categorie.getName());
            }

            // Track description changes
            if ((existingCategory.getDescription() == null && categorie.getDescription() != null) ||
                (existingCategory.getDescription() != null && !existingCategory.getDescription().equals(categorie.getDescription()))) {
                changes.append(String.format("Mô tả: '%s' thành '%s', ", 
                    existingCategory.getDescription(), categorie.getDescription()));
                existingCategory.setDescription(categorie.getDescription());
            }

            // If there are any changes, save and log them
            if (changes.length() > 0) {
                // Remove trailing comma and space
                String changeLog = changes.substring(0, changes.length() - 2);
                
                Categorie updatedCategory = dao.save(existingCategory);
                
                userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.UPDATE_CATEGORIE,
                    "Cập nhật danh mục - " + changeLog,
                    getClientIp(request),
                    getClientInfo(request)
                );
                
                return ResponseEntity.ok(updatedCategory);
            } else {
                return new ResponseEntity<>("Không có thay đổi nào được thực hiện!", HttpStatus.OK);
            }

        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer id,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // 🔥 Kiểm tra xem danh mục có tồn tại không
            if (!dao.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Danh mục không tồn tại!");
            }

            // 🔥 Kiểm tra xem danh mục có sản phẩm liên quan không
            if (productsDAO.existsByCategorieId(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Không thể xóa danh mục vì có sản phẩm liên quan!");
            }

            // ✅ Xóa danh mục nếu không có sản phẩm liên quan
            dao.deleteById(id);

            // Log user action
            userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.DELETE_CATEGORIE,
                    "Xóa danh mục #" + id,
                    getClientIp(request),
                    getClientInfo(request));

            return ResponseEntity.ok("Xóa danh mục thành công!");

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa danh mục do dữ liệu tham chiếu!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi không xác định khi xóa danh mục!");
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
