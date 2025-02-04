package com.shopethethao.modules.productSizes;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.products.Product;
@RestController
@RequestMapping("/api/productsizes")
public class ProductSizeAPI {

    @Autowired
    private ProductSizeDAO productSizeDao;

    // GET /api/productsizes/all: Retrieve all product sizes without pagination
    @GetMapping("/get/all")
    public ResponseEntity<List<ProductSize>> findAll() {
        List<ProductSize> productSize = productSizeDao.findAll();
        return ResponseEntity.ok(productSize);
    }

    // GET /api/productsizes: Retrieve paginated product sizes
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
                                     @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<ProductSize> page = productSizeDao.findAll(pageable);

            ResponseDTO<ProductSize> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST /api/productsizes: Add new product size
    @PostMapping
    public ResponseEntity<ProductSize> addProductSize(@RequestBody ProductSize productSize) {
        try {
            ProductSize savedSize = productSizeDao.save(productSize);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSize);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/productsizes/{id}: Delete product size by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductSize(@PathVariable Integer id) {
        if (productSizeDao.existsById(id)) {
            productSizeDao.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.notFound().build(); // 404 Not Found if size doesn't exist
    }
}
