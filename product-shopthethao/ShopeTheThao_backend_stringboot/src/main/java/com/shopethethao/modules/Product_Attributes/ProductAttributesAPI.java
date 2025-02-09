package com.shopethethao.modules.Product_Attributes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.products.Product;

import java.util.List;
import java.util.Optional;

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

    // ✅ Thêm một thuộc tính mới
    @PostMapping
    public ResponseEntity<ProductAttributes> addAttribute(@RequestBody ProductAttributes attribute) {
        return ResponseEntity.ok(productAttributesDAO.save(attribute));
    }

    // ✅ Cập nhật thuộc tính
    @PutMapping("/{id}")
    public ResponseEntity<ProductAttributes> updateAttribute(@PathVariable Integer id,
            @RequestBody ProductAttributes newAttribute) {
        return productAttributesDAO.findById(id)
                .map(attribute -> {
                    attribute.setName(newAttribute.getName());
                    return ResponseEntity.ok(productAttributesDAO.save(attribute));
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Xóa một thuộc tính
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttribute(@PathVariable Integer id) {
        if (productAttributesDAO.existsById(id)) {
            productAttributesDAO.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
