package com.shopethethao.modules.products;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.shopethethao.dto.ProductDetailDTO;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.productSizes.ProductSize;
import com.shopethethao.modules.productSizes.ProductSizeDAO;
import com.shopethethao.modules.product_Images.ProductImages;
import com.shopethethao.modules.product_Images.ProductImagesDAO;
import com.shopethethao.modules.size.Size;
import com.shopethethao.modules.size.SizeDAO;
import com.shopethethao.service.ProductService;
import com.shopethethao.service.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

import com.shopethethao.modules.userHistory.UserActionType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/products")
public class ProductsAPI {
    private static final Logger logger = LoggerFactory.getLogger(ProductsAPI.class);

    @Autowired
    private UserHistoryService userHistoryService;

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

    @Autowired
    private HttpServletRequest request;

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
                if (product.getSizes().get(i).getSize() == null
                        || product.getSizes().get(i).getSize().getId() == null) {
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

            // Log with detailed information
            String userId = getCurrentUserId();
            String logMessage = createProductLogMessage(userId, savedProduct);
            userHistoryService.logUserAction(
                    userId,
                    UserActionType.CREATE_PRODUCT,
                    logMessage,
                    getClientIp(),
                    getDeviceInfo());

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
            logger.error("Error creating product: {}", e.getMessage(), e);
            return new ResponseEntity<>("Lỗi khi thêm sản phẩm: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Cập nhật sản phẩm và kích cỡ
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateProduct(@PathVariable("id") Integer id,
            @RequestBody Product product) {
        try {
            Optional<Product> existingProductOpt = productsDAO.findById(id);
            if (existingProductOpt.isEmpty()) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            Product oldProduct = existingProductOpt.get();
            // Store current state before updates
            Product oldState = new Product();
            BeanUtils.copyProperties(oldProduct, oldState);

            Product updatedProduct = oldProduct;
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

            // Log with detailed change information
            String userId = getCurrentUserId();
            String logMessage = createUpdateLogMessage(userId, oldState, oldProduct);
            userHistoryService.logUserAction(
                    userId,
                    UserActionType.UPDATE_PRODUCT,
                    logMessage,
                    getClientIp(),
                    getDeviceInfo());

            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            logger.error("Error updating product {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>("Lỗi hệ thống, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // **Xóa sản phẩm và size liên quan**
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Integer id) {
        try {
            Optional<Product> productOpt = productsDAO.findById(id);
            if (productOpt.isEmpty()) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            Product product = productOpt.get();
            String userId = getCurrentUserId();

            // Create detailed log before deletion
            String logMessage = createDeleteLogMessage(userId, product);

            productSizeDAO.deleteByProductId(id);
            productsDAO.deleteById(id);
            productImagesDAO.deleteByProductId(id);

            // Log the deletion with detailed information
            userHistoryService.logUserAction(
                    userId,
                    UserActionType.DELETE_PRODUCT,
                    logMessage,
                    getClientIp(),
                    getDeviceInfo());

            return ResponseEntity.ok("Xóa sản phẩm và size thành công!");
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting product {}: {}", id, e.getMessage());
            return new ResponseEntity<>("Không thể xóa sản phẩm do dữ liệu tham chiếu!", HttpStatus.CONFLICT);
        } catch (Exception e) {
            logger.error("Error deleting product {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/details/{productId}")
    public List<ProductDetailDTO> getProductDetails(@PathVariable Integer productId) {
        return productService.getProductDetailsById(productId);
    }

    // Helper method to get current user ID
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    // Helper method to get client IP
    private String getClientIp() {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    // Helper method to get device info
    private String getDeviceInfo() {
        return request.getHeader("User-Agent");
    }

    // Create detailed log message for product creation
    private String createProductLogMessage(String adminUsername, Product savedProduct) {
        StringBuilder logMessage = new StringBuilder();

        // Get category name safely
        String categoryName = savedProduct.getCategorie() != null ? savedProduct.getCategorie().getName()
                : "Không có danh mục";

        // Format header section
        logMessage.append(String.format("""
                ADMIN: %s đã thêm sản phẩm mới
                ═══════════════════════════════
                THÔNG TIN CƠ BẢN:
                - ID: #%d
                - Tên sản phẩm: %s
                - Danh mục: %s
                - Mô tả: %s
                - Trạng thái: %s
                """,
                adminUsername,
                savedProduct.getId(),
                savedProduct.getName(),
                categoryName,
                savedProduct.getDescription() != null ? savedProduct.getDescription() : "Không có",
                savedProduct.getStatus() != null && savedProduct.getStatus() ? "Hoạt động" : "Không hoạt động"));

        // Format size and price section
        if (savedProduct.getSizes() != null && !savedProduct.getSizes().isEmpty()) {
            logMessage.append("\nCHI TIẾT KÍCH CỠ VÀ GIÁ:");
            // Sort sizes by name for consistent display
            savedProduct.getSizes().stream()
                    .sorted((s1, s2) -> s1.getSize().getName().compareTo(s2.getSize().getName()))
                    .forEach(size -> {
                        logMessage.append(String.format("""

                                ✦ Size %s:
                                  └─ Số lượng: %d cái
                                  └─ Giá bán: %s""",
                                size.getSize().getName(),
                                size.getQuantity(),
                                formatPrice(size.getPrice())));
                    });

            // Add total quantity and price range
            int totalQuantity = savedProduct.getSizes().stream()
                    .mapToInt(ProductSize::getQuantity)
                    .sum();

            Integer minPrice = savedProduct.getSizes().stream()
                    .map(ProductSize::getPrice)
                    .min(Integer::compareTo)
                    .orElse(0);

            Integer maxPrice = savedProduct.getSizes().stream()
                    .map(ProductSize::getPrice)
                    .max(Integer::compareTo)
                    .orElse(0);

            logMessage.append(String.format("""

                    ═══════════════════════════════
                    TỔNG QUAN:
                    - Tổng số lượng: %d cái
                    - Khoảng giá: %s → %s""",
                    totalQuantity,
                    formatPrice(minPrice),
                    formatPrice(maxPrice)));
        }

        // Format images section
        if (savedProduct.getImages() != null && !savedProduct.getImages().isEmpty()) {
            logMessage.append(String.format("""

                    ═══════════════════════════════
                    HÌNH ẢNH (%d):""",
                    savedProduct.getImages().size()));

            for (int i = 0; i < Math.min(savedProduct.getImages().size(), 3); i++) {
                logMessage.append(String.format("""

                        %d. %s""",
                        i + 1,
                        savedProduct.getImages().get(i).getImageUrl()));
            }

            if (savedProduct.getImages().size() > 3) {
                logMessage.append(String.format("""

                        ... và %d hình ảnh khác""",
                        savedProduct.getImages().size() - 3));
            }
        }

        return logMessage.toString();
    }

    private String createUpdateLogMessage(String adminUsername, Product oldProduct, Product updatedProduct) {
        StringBuilder logMessage = new StringBuilder();

        // Get category names
        String oldCategoryName = oldProduct.getCategorie() != null ? oldProduct.getCategorie().getName()
                : "Không có danh mục";
        String newCategoryName = updatedProduct.getCategorie() != null ? updatedProduct.getCategorie().getName()
                : "Không có danh mục";

        // Format header with divider and timestamp
        logMessage.append(String.format("""
                ══════════════════════════════════════════════════
                ADMIN: %s đã cập nhật sản phẩm #%d
                Thời gian: %s
                ══════════════════════════════════════════════════

                [1] THÔNG TIN CƠ BẢN:
                """,
                adminUsername,
                updatedProduct.getId(),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"))));

        // Track if any basic changes were made
        boolean hasBasicChanges = false;

        // Compare and format name changes
        if (!Objects.equals(oldProduct.getName(), updatedProduct.getName())) {
            logMessage.append(formatDetailedChange("Tên sản phẩm", oldProduct.getName(), updatedProduct.getName()));
            hasBasicChanges = true;
        }

        // Compare and format category changes
        if (!oldCategoryName.equals(newCategoryName)) {
            logMessage.append(formatDetailedChange("Danh mục", oldCategoryName, newCategoryName));
            hasBasicChanges = true;
        }

        // Compare and format description changes
        if (!Objects.equals(oldProduct.getDescription(), updatedProduct.getDescription())) {
            logMessage.append(
                    formatDetailedChange("Mô tả", oldProduct.getDescription(), updatedProduct.getDescription()));
            hasBasicChanges = true;
        }

        // Compare and format status changes
        if (!Objects.equals(oldProduct.getStatus(), updatedProduct.getStatus())) {
            logMessage.append(formatDetailedChange("Trạng thái",
                    oldProduct.getStatus() != null && oldProduct.getStatus() ? "Hoạt động" : "Không hoạt động",
                    updatedProduct.getStatus() != null && updatedProduct.getStatus() ? "Hoạt động"
                            : "Không hoạt động"));
            hasBasicChanges = true;
        }

        // If no basic changes, indicate it
        if (!hasBasicChanges) {
            logMessage.append("\nKhông có thay đổi thông tin cơ bản");
        }

        // Size changes section with detailed comparison
        logMessage.append("\n\n[2] THAY ĐỔI KÍCH CỠ VÀ GIÁ:");
        compareSizesWithDetails(oldProduct.getSizes(), updatedProduct.getSizes(), logMessage);

        // Image changes section with detailed formatting (similar to creation log)
        logMessage.append("\n\n[3] THAY ĐỔI HÌNH ẢNH:");
        formatImageChangesDetailed(oldProduct.getImages(), updatedProduct.getImages(), logMessage);

        return logMessage.toString();
    }

    private void formatImageChangesDetailed(List<ProductImages> oldImages, List<ProductImages> newImages,
            StringBuilder logMessage) {
        int oldCount = oldImages != null ? oldImages.size() : 0;
        int newCount = newImages != null ? newImages.size() : 0;

        logMessage.append(String.format("""
                ├─ Số lượng cũ: %d hình%s
                └─ Số lượng mới: %d hình%s""",
                oldCount,
                oldCount > 0 ? formatImageUrls(oldImages, "CŨ") : "",
                newCount,
                newCount > 0 ? formatImageUrls(newImages, "MỚI") : ""));
    }

    private String formatImageUrls(List<ProductImages> images, String label) {
        if (images == null || images.isEmpty())
            return "";

        StringBuilder urls = new StringBuilder(String.format("\n   Danh sách hình ảnh %s:", label));
        for (int i = 0; i < Math.min(images.size(), 3); i++) {
            urls.append(String.format("\n   %d. %s", i + 1, images.get(i).getImageUrl()));
        }
        if (images.size() > 3) {
            urls.append(String.format("\n   ... và %d hình ảnh khác", images.size() - 3));
        }
        return urls.toString();
    }

    private void compareSizesWithDetails(List<ProductSize> oldSizes, List<ProductSize> newSizes,
            StringBuilder logMessage) {
        if (oldSizes == null)
            oldSizes = new ArrayList<>();
        if (newSizes == null)
            newSizes = new ArrayList<>();

        Map<Integer, ProductSize> oldSizeMap = oldSizes.stream()
                .collect(Collectors.toMap(s -> s.getSize().getId(), s -> s, (s1, s2) -> s1));
        Map<Integer, ProductSize> newSizeMap = newSizes.stream()
                .collect(Collectors.toMap(s -> s.getSize().getId(), s -> s, (s1, s2) -> s1));

        Set<Integer> allSizeIds = new HashSet<>();
        allSizeIds.addAll(oldSizeMap.keySet());
        allSizeIds.addAll(newSizeMap.keySet());

        // Track totals for summary
        int oldTotalQty = 0, newTotalQty = 0;
        BigDecimal oldTotalValue = BigDecimal.ZERO, newTotalValue = BigDecimal.ZERO;

        // Sort sizes by name for consistent display
        List<Integer> sortedSizeIds = new ArrayList<>(allSizeIds);
        sortedSizeIds.sort((id1, id2) -> {
            String name1 = getSizeName(id1);
            String name2 = getSizeName(id2);
            return name1.compareTo(name2);
        });

        // Track changes by type
        List<String> addedSizes = new ArrayList<>();
        List<String> removedSizes = new ArrayList<>();
        List<String> modifiedSizes = new ArrayList<>();

        for (Integer sizeId : sortedSizeIds) {
            ProductSize oldSize = oldSizeMap.get(sizeId);
            ProductSize newSize = newSizeMap.get(sizeId);
            String sizeName = getSizeName(sizeId);

            if (oldSize == null && newSize != null) {
                // Added size
                addedSizes.add(String.format("""

                        ➕ THÊM MỚI Size %s:
                           ├─ Số lượng: %d cái
                           └─ Giá bán: %s""",
                        sizeName,
                        newSize.getQuantity(),
                        formatPrice(newSize.getPrice())));
                newTotalQty += newSize.getQuantity();
                newTotalValue = newTotalValue.add(BigDecimal.valueOf(newSize.getPrice() * newSize.getQuantity()));
            } else if (oldSize != null && newSize == null) {
                // Removed size
                removedSizes.add(String.format("""

                        ➖ ĐÃ XÓA Size %s:
                           ├─ Số lượng: %d cái
                           └─ Giá bán: %s""",
                        sizeName,
                        oldSize.getQuantity(),
                        formatPrice(oldSize.getPrice())));
                oldTotalQty += oldSize.getQuantity();
                oldTotalValue = oldTotalValue.add(BigDecimal.valueOf(oldSize.getPrice() * oldSize.getQuantity()));
            } else if (oldSize != null && newSize != null) {
                // Check for modifications
                List<String> changes = new ArrayList<>();
                if (!Objects.equals(oldSize.getQuantity(), newSize.getQuantity())) {
                    String trend = newSize.getQuantity() > oldSize.getQuantity() ? "↑" : "↓";
                    int diff = Math.abs(newSize.getQuantity() - oldSize.getQuantity());
                    changes.add(String.format("├─ Số lượng: %d → %d cái (%s%d)",
                            oldSize.getQuantity(),
                            newSize.getQuantity(),
                            trend,
                            diff));
                }
                if (!Objects.equals(oldSize.getPrice(), newSize.getPrice())) {
                    String trend = newSize.getPrice() > oldSize.getPrice() ? "↑" : "↓";
                    int diff = Math.abs(newSize.getPrice() - oldSize.getPrice());
                    changes.add(String.format("└─ Giá bán: %s → %s (%s%s)",
                            formatPrice(oldSize.getPrice()),
                            formatPrice(newSize.getPrice()),
                            trend,
                            formatPrice(diff)));
                }
                if (!changes.isEmpty()) {
                    modifiedSizes.add(String.format("""

                            ✏ Size %s:
                            %s""",
                            sizeName,
                            String.join("\n", changes)));
                }

                oldTotalQty += oldSize.getQuantity();
                newTotalQty += newSize.getQuantity();
                oldTotalValue = oldTotalValue.add(BigDecimal.valueOf(oldSize.getPrice() * oldSize.getQuantity()));
                newTotalValue = newTotalValue.add(BigDecimal.valueOf(newSize.getPrice() * newSize.getQuantity()));
            }
        }

        // Add changes in organized sections
        if (!addedSizes.isEmpty()) {
            logMessage.append("\n🆕 KÍCH CỠ MỚI THÊM:");
            addedSizes.forEach(logMessage::append);
        }
        if (!removedSizes.isEmpty()) {
            logMessage.append("\n❌ KÍCH CỠ ĐÃ XÓA:");
            removedSizes.forEach(logMessage::append);
        }
        if (!modifiedSizes.isEmpty()) {
            logMessage.append("\n📝 KÍCH CỠ ĐÃ CHỈNH SỬA:");
            modifiedSizes.forEach(logMessage::append);
        }

        // Add summary if there are any changes
        if (oldTotalQty != newTotalQty || !oldTotalValue.equals(newTotalValue)) {
            int qtyDiff = newTotalQty - oldTotalQty;
            BigDecimal valueDiff = newTotalValue.subtract(oldTotalValue);
            logMessage.append(String.format("""

                    ══════════════════════════════════════════════════
                    📊 TỔNG HỢP THAY ĐỔI:
                    ├─ Số lượng: %d → %d cái (%s%d)
                    ├─ Tổng giá trị: %s → %s
                    └─ Chênh lệch: %s%s""",
                    oldTotalQty,
                    newTotalQty,
                    qtyDiff > 0 ? "+" : "",
                    Math.abs(qtyDiff),
                    formatPrice(oldTotalValue),
                    formatPrice(newTotalValue),
                    valueDiff.compareTo(BigDecimal.ZERO) > 0 ? "+" : "",
                    formatPrice(valueDiff.abs())));
        } else {
            logMessage.append("\n💡 Không có thay đổi về số lượng và giá trị");
        }
    }

    // Create detailed log message for product deletion
    private String createDeleteLogMessage(String adminUsername, Product product) {
        StringBuilder logMessage = new StringBuilder();
        logMessage.append(String.format("""
                ADMIN: %s đã xóa sản phẩm
                Chi tiết sản phẩm đã xóa:
                - ID: #%d
                - Tên sản phẩm: %s
                - Danh mục: %s
                """,
                adminUsername,
                product.getId(),
                product.getName(),
                product.getCategorie() != null ? product.getCategorie().getName() : "Không có"));

        // Add size-specific information
        if (product.getSizes() != null && !product.getSizes().isEmpty()) {
            logMessage.append("\nChi tiết kích cỡ đã xóa:");
            for (ProductSize size : product.getSizes()) {
                logMessage.append(String.format("""

                        ✦ Size: %s
                          - Số lượng: %d cái
                          - Giá: %s""",
                        size.getSize().getName(),
                        size.getQuantity(),
                        formatPrice(size.getPrice())));
            }

            // Add total quantity
            int totalQuantity = product.getSizes().stream()
                    .mapToInt(ProductSize::getQuantity)
                    .sum();
            logMessage.append(String.format("\n\nTổng số lượng đã xóa: %d cái", totalQuantity));
        }

        // Add image count
        logMessage.append(String.format("\nSố lượng hình ảnh đã xóa: %d",
                product.getImages() != null ? product.getImages().size() : 0));

        return logMessage.toString();
    }

    private void compareSizes(List<ProductSize> oldSizes, List<ProductSize> newSizes, StringBuilder logMessage) {
        Map<Integer, ProductSize> oldSizeMap = oldSizes.stream()
                .collect(Collectors.toMap(s -> s.getSize().getId(), s -> s));
        Map<Integer, ProductSize> newSizeMap = newSizes.stream()
                .collect(Collectors.toMap(s -> s.getSize().getId(), s -> s));

        Set<Integer> allSizeIds = new HashSet<>();
        allSizeIds.addAll(oldSizeMap.keySet());
        allSizeIds.addAll(newSizeMap.keySet());

        boolean hasSizeChanges = false;
        StringBuilder sizeChanges = new StringBuilder("\nThay đổi chi tiết kích cỡ:");

        for (Integer sizeId : allSizeIds) {
            ProductSize oldSize = oldSizeMap.get(sizeId);
            ProductSize newSize = newSizeMap.get(sizeId);

            if (oldSize == null) {
                hasSizeChanges = true;
                sizeChanges.append(String.format("""

                        ➕ Thêm mới size %s:
                           Số lượng: %d cái
                           Giá: %s""",
                        newSize.getSize().getName(),
                        newSize.getQuantity(),
                        formatPrice(newSize.getPrice())));
            } else if (newSize == null) {
                hasSizeChanges = true;
                sizeChanges.append(String.format("""

                        ➖ Đã xóa size %s:
                           Số lượng: %d cái
                           Giá: %s""",
                        oldSize.getSize().getName(),
                        oldSize.getQuantity(),
                        formatPrice(oldSize.getPrice())));
            } else if (!Objects.equals(oldSize.getQuantity(), newSize.getQuantity()) ||
                    !Objects.equals(oldSize.getPrice(), newSize.getPrice())) {
                hasSizeChanges = true;
                sizeChanges.append(String.format("""

                        ✏ Size %s:
                           Số lượng: %d → %d cái
                           Giá: %s → %s""",
                        oldSize.getSize().getName(),
                        oldSize.getQuantity(),
                        newSize.getQuantity(),
                        formatPrice(oldSize.getPrice()),
                        formatPrice(newSize.getPrice())));
            }
        }

        if (hasSizeChanges) {
            logMessage.append(sizeChanges);
        }
    }

    private String formatPrice(BigDecimal price) {
        if (price == null)
            return "0 đ";
        return String.format("%,.0f đ", price);
    }

    // Add overload for Integer
    private String formatPrice(Integer price) {
        if (price == null)
            return "0 đ";
        return String.format("%,d đ", price);
    }

    private String getSizeName(Integer sizeId) {
        if (sizeId == null)
            return "Không xác định";
        Optional<Size> size = sizeDAO.findById(sizeId);
        return size.map(Size::getName).orElse("Không xác định");
    }

    private String formatDetailedChange(String field, String oldValue, String newValue) {
        return String.format("""

                ├─ %s:
                │  ├─ Cũ: %s
                │  └─ Mới: %s""",
                field,
                oldValue != null ? oldValue : "Không có",
                newValue != null ? newValue : "Không có");
    }
}
