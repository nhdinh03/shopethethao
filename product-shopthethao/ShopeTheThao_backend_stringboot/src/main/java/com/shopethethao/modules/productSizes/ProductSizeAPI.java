package com.shopethethao.modules.productSizes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productsizes")
public class ProductSizeAPI {

    @Autowired
    private ProductSizeDAO productSizeDao;

    @GetMapping("/get/all")
    public ResponseEntity<List<ProductSize>> findAll() {
        List<ProductSize> productSize = productSizeDao.findAll();
        return ResponseEntity.ok(productSize);
    }

    // **Thêm mới kích cỡ cho sản phẩm**
    @PostMapping
    public ResponseEntity<ProductSize> addProductSize(@RequestBody ProductSize productSize) {
        try {
            // Lưu ProductSize vào cơ sở dữ liệu
            ProductSize savedSize = productSizeDao.save(productSize);

            // Trả về ProductSize với mã trạng thái CREATED (201)
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSize);
        } catch (Exception e) {
            // Nếu có lỗi, trả về thông báo lỗi dưới dạng chuỗi
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductSize(@PathVariable Integer id) {
        if (productSizeDao.existsById(id)) {
            productSizeDao.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.notFound().build(); // 404 Not Found if size doesn't exist
    }

}
