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

import com.shopethethao.dto.ProductDetailDTO;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.productSizes.ProductSize;
import com.shopethethao.modules.productSizes.ProductSizeDAO;
import com.shopethethao.modules.product_Images.ProductImages;
import com.shopethethao.modules.product_Images.ProductImagesDAO;
import com.shopethethao.modules.size.Size;
import com.shopethethao.modules.size.SizeDAO;
import com.shopethethao.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductsAPI {

    @Autowired
    private ProductsDAO productsDAO;

    @Autowired
    private ProductSizeDAO productSizeDAO;

    @Autowired
    private SizeDAO sizeDAO;

    @Autowired
    private ProductImagesDAO productImagesDAO;

    @Autowired
    private ProductService productService;

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
            // Validate basic product info
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return new ResponseEntity<>("Tên sản phẩm không được để trống!", HttpStatus.BAD_REQUEST);
            }

            // Validate sizes
            if (product.getSizes() == null || product.getSizes().isEmpty()) {
                return new ResponseEntity<>("Phải có ít nhất một kích cỡ cho sản phẩm!", HttpStatus.BAD_REQUEST);
            }

            // Check for duplicate sizes before saving
            for (int i = 0; i < product.getSizes().size(); i++) {
                if (product.getSizes().get(i).getSize() == null || product.getSizes().get(i).getSize().getId() == null) {
                    return new ResponseEntity<>("Thông tin kích cỡ không hợp lệ!", HttpStatus.BAD_REQUEST);
                }
                
                for (int j = i + 1; j < product.getSizes().size(); j++) {
                    if (product.getSizes().get(i).getSize().getId()
                            .equals(product.getSizes().get(j).getSize().getId())) {
                        return new ResponseEntity<>(
                                "Kích cỡ " + product.getSizes().get(i).getSize().getName() + " bị trùng lặp!",
                                HttpStatus.BAD_REQUEST);
                    }
                }
            }

            // Save product first
            Product savedProduct = productsDAO.save(product);

            // Save sizes
            for (ProductSize size : product.getSizes()) {
                Optional<Size> existingSize = sizeDAO.findById(size.getSize().getId());
                if (!existingSize.isPresent()) {
                    return new ResponseEntity<>("Kích cỡ không tồn tại trong hệ thống!", HttpStatus.BAD_REQUEST);
                }
                size.setSize(existingSize.get());
                size.setProduct(savedProduct);
                productSizeDAO.save(size);
            }

            // Save images if present
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                for (ProductImages img : product.getImages()) {
                    if (img.getImageUrl() == null || img.getImageUrl().trim().isEmpty()) {
                        return new ResponseEntity<>("URL hình ảnh không hợp lệ!", HttpStatus.BAD_REQUEST);
                    }
                    img.setProduct(savedProduct);
                    productImagesDAO.save(img);
                }
            }

            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return new ResponseEntity<>("Lỗi khi thêm sản phẩm: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Cập nhật sản phẩm và kích cỡ
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateProduct(@PathVariable("id") Integer id,
            @RequestBody Product product) {
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
            updatedProduct.setStatus(product.getStatus());
            updatedProduct.setCategorie(product.getCategorie());

            productSizeDAO.deleteByProductId(id);

            // **Kiểm tra trùng kích cỡ trước khi cập nhật**
            for (int i = 0; i < product.getSizes().size(); i++) {
                for (int j = i + 1; j < product.getSizes().size(); j++) {
                    // So sánh kích cỡ
                    if (product.getSizes().get(i).getSize().getId()
                            .equals(product.getSizes().get(j).getSize().getId())) {
                        return new ResponseEntity<>(
                                "Kích cỡ " + product.getSizes().get(i).getSize().getName() + " đã tồn tại!",
                                HttpStatus.BAD_REQUEST);
                    }
                }
            }

            // **Xóa toàn bộ size trước khi cập nhật sản phẩm**
            productSizeDAO.deleteByProductId(id);

            // **Nếu `sizes` tồn tại trong request, cập nhật lại size mới**
            if (product.getSizes() != null && !product.getSizes().isEmpty()) {
                for (ProductSize size : product.getSizes()) {
                    // Kiểm tra xem kích cỡ đã tồn tại chưa
                    Optional<ProductSize> existingSize = productSizeDAO.findByProductIdAndSizeId(id,
                            size.getSize().getId());
                    if (existingSize.isPresent()) {
                        return new ResponseEntity<>(
                                "Kích cỡ " + size.getSize().getName() + " đã tồn tại trong danh sách sản phẩm!",
                                HttpStatus.BAD_REQUEST);
                    }
                    size.setProduct(updatedProduct);
                    productSizeDAO.save(size);
                }
            }

            // ✅ Cập nhật hình ảnh (nếu có)
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                productImagesDAO.deleteByProductId(id); // Xóa ảnh cũ
                for (ProductImages image : product.getImages()) {
                    image.setProduct(updatedProduct);
                    productImagesDAO.save(image);
                }
            }

            productsDAO.save(updatedProduct);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi hệ thống, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
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

            // xóa
            productSizeDAO.deleteByProductId(id);
            productsDAO.deleteById(id);
            productImagesDAO.deleteByProductId(id);

            return ResponseEntity.ok("Xóa sản phẩm và size thành công!");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa sản phẩm do dữ liệu tham chiếu!", HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/details/{productId}")
    public List<ProductDetailDTO> getProductDetails(@PathVariable Integer productId) {
        return productService.getProductDetailsById(productId);
    }
}
