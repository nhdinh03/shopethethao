package com.shopethethao.modules.productSizes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

//     @PostMapping("/add")
// public ResponseEntity<?> createProduct(@RequestBody Product product) {
//     if (product.getSizes() == null || product.getSizes().isEmpty()) {
//         return ResponseEntity.badRequest().body("Vui lòng thêm ít nhất một kích thước!");
//     }
//     // 🔥 Tính tổng số lượng sản phẩm từ size
//     int totalQuantity = product.getSizes().stream().mapToInt(ProductSize::getQuantity).sum();
//     product.setQuantity(totalQuantity);
//     // Gán product cho từng size
//     product.getSizes().forEach(size -> size.setProduct(product));
//     productRepository.save(product);
//     return ResponseEntity.ok("Thêm sản phẩm thành công!");
// }
}
