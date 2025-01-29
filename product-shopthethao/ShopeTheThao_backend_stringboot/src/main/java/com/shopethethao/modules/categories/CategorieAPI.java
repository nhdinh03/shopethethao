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

@RestController
@RequestMapping("/api/categories")
public class CategorieAPI {

    @Autowired
    private CategorieDAO dao;

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
    public ResponseEntity<?> create(@RequestBody Categorie category) {
        try {
            Categorie savedCategory = dao.save(category);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể thêm danh mục!", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer id,
            @RequestBody Categorie categorie) {
        try {
            // 🔹 Kiểm tra danh mục có tồn tại không
            Optional<Categorie> existingCategory = dao.findById(id);
            if (existingCategory.isEmpty()) {
                return new ResponseEntity<>("Danh mục không tồn tại!", HttpStatus.NOT_FOUND);
            }

            // 🔹 Kiểm tra xem tên danh mục đã tồn tại chưa (không tính chính nó)
            Optional<Categorie> duplicateCategory = dao.findByName(categorie.getName());
            if (duplicateCategory.isPresent() && !duplicateCategory.get().getId().equals(id)) {
                return new ResponseEntity<>("Tên danh mục đã tồn tại!", HttpStatus.CONFLICT);
            }

            // ✅ Cập nhật thông tin danh mục
            Categorie updatedCategorie = existingCategory.get();
            updatedCategorie.setName(categorie.getName());
            updatedCategorie.setDescription(categorie.getDescription());

            dao.save(updatedCategorie);
            return ResponseEntity.ok(updatedCategorie);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer id) {
        try {
            if (!dao.existsById(id)) {
                return new ResponseEntity<>("Danh mục không tồn tại!", HttpStatus.NOT_FOUND);
            }

            dao.deleteById(id);
            return ResponseEntity.ok("Xóa danh mục thành công!");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa danh mục do dữ liệu tham chiếu!", HttpStatus.CONFLICT);
        }
    }

}
