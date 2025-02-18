package com.shopethethao.modules.product_Attribute_Mappings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productattributemappings")
public class ProductAttributeMappingsAPI {

    @Autowired
    private ProductAttributeMappingsDAO productAttributeMappingsDAO;

    // ✅ Lấy tất cả quan hệ sản phẩm - đặc điểm
    @GetMapping("get/all")
    public ResponseEntity<List<ProductAttributeMappings>> getAllMappings() {
        return ResponseEntity.ok(productAttributeMappingsDAO.findAll());
    }

    // ✅ Thêm quan hệ giữa sản phẩm và đặc điểm
    @PostMapping("/add")
    public ResponseEntity<ProductAttributeMappings> addMapping(@RequestBody ProductAttributeMappings mapping) {
        return ResponseEntity.ok(productAttributeMappingsDAO.save(mapping));
    }

    // ✅ Xóa một quan hệ giữa sản phẩm và đặc điểm
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteMapping(@RequestParam Integer productId, @RequestParam Integer attributeId) {
        productAttributeMappingsDAO.deleteByProductIdAndAttributeId(productId, attributeId);
        return ResponseEntity.ok().build();
    }
}
