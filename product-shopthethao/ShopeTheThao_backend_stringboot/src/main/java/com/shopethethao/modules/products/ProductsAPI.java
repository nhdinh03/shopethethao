package com.shopethethao.modules.products;

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
import org.springframework.transaction.annotation.Transactional;
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
import com.shopethethao.modules.productSizes.ProductSize;
import com.shopethethao.modules.productSizes.ProductSizeDAO;

@RestController
@RequestMapping("/api/products")
public class ProductsAPI {

    @Autowired
    private ProductsDAO productsDAO;

    @Autowired
    private ProductSizeDAO productSizeDAO;

    // Lấy toàn bộ danh sách sản phẩm (không phân trang)
    @GetMapping("/get/all")
    public ResponseEntity<List<Product>> findAll() {
        List<Product> products = productsDAO.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Optional<Product> product = productsDAO.findByIdWithSizes(id);
        return product.isPresent() ? ResponseEntity.ok(product.get()) : ResponseEntity.notFound().build();
    }

    // Lấy danh sách sản phẩm có phân trang
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Product> page = productsDAO.findAll(pageable);
            ResponseDTO<Product> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // **Thêm mới sản phẩm**
    @PostMapping
    public ResponseEntity<?> createProductWithSizes(@RequestBody Product product) {
        try {
            Product savedProduct = productsDAO.save(product);
            if (product.getSizes() != null && !product.getSizes().isEmpty()) {
                for (ProductSize size : product.getSizes()) {
                    size.setProduct(savedProduct);
                    productSizeDAO.save(size);
                }
            }
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể thêm sản phẩm!", HttpStatus.BAD_REQUEST);
        }
    }

    // **Cập nhật sản phẩm và kích cỡ**
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateProduct(@PathVariable("id") Integer id, @RequestBody Product product) {
        try {
            Optional<Product> existingProduct = productsDAO.findById(id);
            if (existingProduct.isEmpty()) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            Product updatedProduct = existingProduct.get();
            updatedProduct.setName(product.getName());
            updatedProduct.setQuantity(product.getQuantity());
            updatedProduct.setPrice(product.getPrice());
            updatedProduct.setDescription(product.getDescription());
            updatedProduct.setStatus(product.isStatus());
            updatedProduct.setImage1(product.getImage1());
            updatedProduct.setImage2(product.getImage2());
            updatedProduct.setCategorie(product.getCategorie());

            // **Xóa toàn bộ size trước khi cập nhật sản phẩm**
            productSizeDAO.deleteByProductId(id);

            // **Nếu `sizes` tồn tại trong request, cập nhật lại size mới**
            if (product.getSizes() != null && !product.getSizes().isEmpty()) {
                for (ProductSize size : product.getSizes()) {
                    size.setProduct(updatedProduct);
                    productSizeDAO.save(size);
                }
            }

            productsDAO.save(updatedProduct);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi hệ thống, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // **Xóa sản phẩm và size liên quan**
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Integer id) {
        try {
            if (!productsDAO.existsById(id)) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            // 🛠️ Xóa tất cả size của sản phẩm trước khi xóa sản phẩm
            productSizeDAO.deleteByProductId(id);

            // 🛠️ Sau đó mới xóa sản phẩm
            productsDAO.deleteById(id);

            return ResponseEntity.ok("Xóa sản phẩm và size thành công!");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa sản phẩm do dữ liệu tham chiếu!", HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
