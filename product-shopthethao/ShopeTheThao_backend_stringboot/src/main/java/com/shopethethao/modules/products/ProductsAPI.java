package com.shopethethao.modules.products;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
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

import com.shopethethao.dto.ProductDetailDTO;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.categories.Categorie;
import com.shopethethao.modules.categories.CategorieDAO;
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
    private CategorieDAO categorieDAO;

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

            // Log with detailed information
            String userId = getCurrentUserId();
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

            try {
                // Create log message with admin username
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String adminUsername = auth.getName(); // Get actual username
                String logMessage = createProductLogMessage(adminUsername, savedProduct);

                // Log the action with full details
                safeLogUserAction(
                        userId,
                        UserActionType.CREATE_PRODUCT,
                        logMessage);
            } catch (Exception e) {
                logger.warn("Failed to log product creation: {}", e.getMessage());
                // Continue execution even if logging fails
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
    public ResponseEntity<?> updateProduct(@PathVariable("id") Integer id, @RequestBody Product product) {
        try {
            String userId = getCurrentUserId();

            Optional<Product> existingProductOpt = productsDAO.findByIdWithSizes(id);
            if (existingProductOpt.isEmpty()) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            Product oldProduct = existingProductOpt.get();
            // Store complete state before updates
            Product oldState = new Product();
            BeanUtils.copyProperties(oldProduct, oldState);
            oldState.setSizes(new ArrayList<>(oldProduct.getSizes()));

            if (oldProduct.getCategorie() != null) {
                Categorie oldCategorie = new Categorie();
                BeanUtils.copyProperties(oldProduct.getCategorie(), oldCategorie);
                oldState.setCategorie(oldCategorie);
            }

            // Update basic properties
            oldProduct.setName(product.getName());
            oldProduct.setQuantity(product.getQuantity());
            oldProduct.setPrice(product.getPrice());
            oldProduct.setDescription(product.getDescription());
            oldProduct.setStatus(product.getStatus());

            // Update category if provided
            if (product.getCategorie() != null) {
                Optional<Categorie> newCategorie = categorieDAO.findById(product.getCategorie().getId());
                if (newCategorie.isPresent()) {
                    oldProduct.setCategorie(newCategorie.get());
                }
            }

            // Handle sizes update
            if (product.getSizes() != null) {
                // Validate sizes first
                Set<Integer> sizeIds = new HashSet<>();
                for (ProductSize size : product.getSizes()) {
                    if (size.getSize() == null || size.getSize().getId() == null) {
                        return new ResponseEntity<>("Thông tin kích cỡ không hợp lệ!", HttpStatus.BAD_REQUEST);
                    }
                    if (!sizeIds.add(size.getSize().getId())) {
                        return new ResponseEntity<>("Kích cỡ bị trùng lặp!", HttpStatus.BAD_REQUEST);
                    }
                }

                // Clear existing sizes
                oldProduct.clearSizes();

                // Add new sizes
                for (ProductSize newSize : product.getSizes()) {
                    Optional<Size> existingSize = sizeDAO.findById(newSize.getSize().getId());
                    if (existingSize.isEmpty()) {
                        return new ResponseEntity<>("Kích cỡ không tồn tại!", HttpStatus.BAD_REQUEST);
                    }

                    ProductSize size = new ProductSize();
                    size.setSize(existingSize.get());
                    size.setQuantity(newSize.getQuantity());
                    size.setPrice(newSize.getPrice());
                    oldProduct.addSize(size);
                }
            }

            // Save the updated product
            Product updatedProduct = productsDAO.save(oldProduct);

            // Log changes
            try {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String adminUsername = auth.getName();
                String logMessage = createUpdateLogMessage(adminUsername, oldState, updatedProduct);

                if (userId != null) {
                    safeLogUserAction(userId, UserActionType.UPDATE_PRODUCT, logMessage);
                    logger.info("Product update logged successfully for user {} and product {}", userId, id);
                }
            } catch (Exception e) {
                logger.error("Failed to log product update: {}", e.getMessage(), e);
            }

            return ResponseEntity.ok(updatedProduct);

        } catch (Exception e) {
            logger.error("Error updating product {}: {}", id, e.getMessage(), e);
            return new ResponseEntity<>("Lỗi hệ thống, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
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
            safeLogUserAction(userId, UserActionType.DELETE_PRODUCT, logMessage);

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

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return "anonymousUser".equals(username) ? null : username;
        }
        return null;
    }

    // Helper method to safely log user actions
    private void safeLogUserAction(String userId, UserActionType actionType, String message) {
        if (userId == null || userId.equals("anonymousUser")) {
            logger.warn("Attempted to log action without valid user");
            return;
        }

        try {
            userHistoryService.logUserAction(
                    userId,
                    actionType,
                    message,
                    getClientIp(),
                    getDeviceInfo());
        } catch (Exception e) {
            logger.warn("Failed to log user action: {}", e.getMessage());
        }
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

    private String getCategoryName(Product product) {
        if (product == null || product.getCategorie() == null) {
            return "Chưa phân loại";
        }

        // Ensure category is loaded from database
        try {
            Integer categoryId = product.getCategorie().getId();
            if (categoryId != null) {
                Optional<Categorie> category = categorieDAO.findById(categoryId);
                if (category.isPresent() && category.get().getName() != null &&
                        !category.get().getName().trim().isEmpty()) {
                    return category.get().getName();
                }
            }
        } catch (Exception e) {
            logger.error("Error loading category for product {}: {}",
                    product.getId(), e.getMessage());
        }

        return "Chưa phân loại";
    }

    // Create detailed log message for product creation
    private String createProductLogMessage(String adminUsername, Product savedProduct) {
        StringBuilder logMessage = new StringBuilder();

        String categoryName = getCategoryName(savedProduct);
        // Format header section
        logMessage.append(String.format("""
                ADMIN: %s đã thêm sản phẩm mới

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
            // Sort sizes by name for consistent display and preload all sizes to avoid N+1
            // queries
            Map<Integer, String> sizeNameCache = preloadSizeNames(savedProduct.getSizes());
            savedProduct.getSizes().stream()
                    .sorted((s1, s2) -> {
                        // Handle possible null values with the preloaded cache
                        String name1 = getSizeNameFromCache(s1, sizeNameCache);
                        String name2 = getSizeNameFromCache(s2, sizeNameCache);
                        return name1.compareTo(name2);
                    })
                    .forEach(size -> {
                        logMessage.append(String.format("""

                                ✦ Size %s:
                                  - Số lượng: %d cái
                                  - Giá bán: %s""",
                                getSizeNameFromCache(size, sizeNameCache),
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

                    TỔNG QUAN:
                    - Tổng số lượng: %d cái
                    - Khoảng giá: %s → %s""",
                    totalQuantity,
                    formatPrice(minPrice),
                    formatPrice(maxPrice)));
        }

        // Format images section with better error handling
        if (savedProduct.getImages() != null && !savedProduct.getImages().isEmpty()) {
            logMessage.append(String.format("""

                    HÌNH ẢNH (%d):""",
                    savedProduct.getImages().size()));

            for (int i = 0; i < Math.min(savedProduct.getImages().size(), 3); i++) {
                ProductImages image = savedProduct.getImages().get(i);
                String imageUrl = image.getImageUrl();
                if (imageUrl == null || imageUrl.trim().isEmpty()) {
                    imageUrl = "Không có URL";
                }
                logMessage.append(String.format("""

                        %d. %s""",
                        i + 1,
                        imageUrl));
            }

            if (savedProduct.getImages().size() > 3) {
                logMessage.append(String.format("""

                        ... và %d hình ảnh khác""",
                        savedProduct.getImages().size() - 3));
            }
        } else {
            logMessage.append("""

                    HÌNH ẢNH (0): Không có hình ảnh""");
        }

        return logMessage.toString();
    }

    private Map<Integer, String> preloadSizeNames(List<ProductSize> sizes) {
        Map<Integer, String> sizeNameMap = new HashMap<>();
        if (sizes == null || sizes.isEmpty()) {
            return sizeNameMap;
        }

        // Extract all size IDs that need to be loaded
        Set<Integer> sizeIds = new HashSet<>();
        for (ProductSize size : sizes) {
            if (size.getSize() != null && size.getSize().getId() != null) {
                sizeIds.add(size.getSize().getId());
            }
        }

        // Batch query to get all sizes at once
        if (!sizeIds.isEmpty()) {
            List<Size> sizeList = sizeDAO.findAllById(sizeIds);
            for (Size size : sizeList) {
                if (size != null && size.getId() != null) {
                    sizeNameMap.put(size.getId(), size.getName() != null ? size.getName() : "Chưa xác định");
                }
            }
        }

        return sizeNameMap;
    }

    private String getSizeNameFromCache(ProductSize productSize, Map<Integer, String> sizeNameCache) {
        if (productSize == null || productSize.getSize() == null || productSize.getSize().getId() == null) {
            return "Chưa xác định";
        }
        return sizeNameCache.getOrDefault(productSize.getSize().getId(), "Chưa xác định");
    }

    private String getSafeSizeName(ProductSize productSize) {
        if (productSize == null) {
            return "Chưa xác định";
        }
        if (productSize.getSize() == null) {
            return "Chưa xác định";
        }

        // Attempt to get size from database if ID is available but name is null
        if (productSize.getSize().getId() != null && productSize.getSize().getName() == null) {
            Optional<Size> size = sizeDAO.findById(productSize.getSize().getId());
            if (size.isPresent() && size.get().getName() != null) {
                return size.get().getName();
            }
        }

        return productSize.getSize().getName() != null ? productSize.getSize().getName() : "Chưa xác định";
    }

    private String createUpdateLogMessage(String adminUsername, Product oldProduct, Product updatedProduct) {
        StringBuilder logMessage = new StringBuilder();

        // Get category names with null safety
        String oldCategoryName = oldProduct.getCategorie() != null && oldProduct.getCategorie().getName() != null
                ? oldProduct.getCategorie().getName()
                : "Không có danh mục";
        String newCategoryName = updatedProduct.getCategorie() != null
                && updatedProduct.getCategorie().getName() != null
                        ? updatedProduct.getCategorie().getName()
                        : "Không có danh mục";

        // Format header
        logMessage.append(String.format("""
                ADMIN: %s đã cập nhật sản phẩm #%d
                Thời gian: %s

                [1] THÔNG TIN CƠ BẢN:""",
                adminUsername,
                updatedProduct.getId(),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"))));

        // Track basic changes
        boolean hasBasicChanges = false;

        if (!Objects.equals(oldProduct.getName(), updatedProduct.getName())) {
            logMessage.append(formatDetailedChange("Tên sản phẩm", oldProduct.getName(), updatedProduct.getName()));
            hasBasicChanges = true;
        }

        if (!Objects.equals(oldCategoryName, newCategoryName)) {
            logMessage.append(formatDetailedChange("Danh mục", oldCategoryName, newCategoryName));
            hasBasicChanges = true;
        }

        if (!Objects.equals(oldProduct.getDescription(), updatedProduct.getDescription())) {
            logMessage.append(formatDetailedChange("Mô tả",
                    oldProduct.getDescription() != null ? oldProduct.getDescription() : "Không có",
                    updatedProduct.getDescription() != null ? updatedProduct.getDescription() : "Không có"));
            hasBasicChanges = true;
        }

        if (!Objects.equals(oldProduct.getPrice(), updatedProduct.getPrice())) {
            logMessage.append(formatDetailedChange("Giá bán",
                    formatPrice(oldProduct.getPrice()),
                    formatPrice(updatedProduct.getPrice())));
            hasBasicChanges = true;
        }

        if (!Objects.equals(oldProduct.getStatus(), updatedProduct.getStatus())) {
            logMessage.append(formatDetailedChange("Trạng thái",
                    oldProduct.getStatus() != null && oldProduct.getStatus() ? "Hoạt động" : "Không hoạt động",
                    updatedProduct.getStatus() != null && updatedProduct.getStatus() ? "Hoạt động"
                            : "Không hoạt động"));
            hasBasicChanges = true;
        }

        if (!hasBasicChanges) {
            logMessage.append("\nKhông có thay đổi thông tin cơ bản");
        }

        // Size changes section
        logMessage.append("\n\n[2] THAY ĐỔI KÍCH CỠ VÀ GIÁ:");

        Map<Integer, ProductSize> oldSizes = oldProduct.getSizes().stream()
                .collect(Collectors.toMap(s -> s.getSize().getId(), s -> s));
        Map<Integer, ProductSize> newSizes = updatedProduct.getSizes().stream()
                .collect(Collectors.toMap(s -> s.getSize().getId(), s -> s));

        Set<Integer> allSizeIds = new HashSet<>();
        allSizeIds.addAll(oldSizes.keySet());
        allSizeIds.addAll(newSizes.keySet());

        boolean hasSizeChanges = false;
        int oldTotalQty = 0, newTotalQty = 0;
        BigDecimal oldTotalValue = BigDecimal.ZERO;
        BigDecimal newTotalValue = BigDecimal.ZERO;

        // Sort size IDs for consistent display
        List<Integer> sortedSizeIds = new ArrayList<>(allSizeIds);
        sortedSizeIds.sort((id1, id2) -> {
            String name1 = oldSizes.containsKey(id1) ? oldSizes.get(id1).getSize().getName()
                    : newSizes.get(id1).getSize().getName();
            String name2 = oldSizes.containsKey(id2) ? oldSizes.get(id2).getSize().getName()
                    : newSizes.get(id2).getSize().getName();
            return name1.compareTo(name2);
        });

        for (Integer sizeId : sortedSizeIds) {
            ProductSize oldSize = oldSizes.get(sizeId);
            ProductSize newSize = newSizes.get(sizeId);
            String sizeName = oldSize != null ? oldSize.getSize().getName() : newSize.getSize().getName();

            if (oldSize == null && newSize != null) {
                logMessage.append(String.format("""

                        ➕ THÊM MỚI Size %s:
                           - Số lượng: %d cái
                           - Giá bán: %s""",
                        sizeName, newSize.getQuantity(), formatPrice(newSize.getPrice())));
                hasSizeChanges = true;
                newTotalQty += newSize.getQuantity();
                newTotalValue = newTotalValue.add(BigDecimal.valueOf(newSize.getPrice() * newSize.getQuantity()));
            } else if (oldSize != null && newSize == null) {
                logMessage.append(String.format("""

                        ➖ ĐÃ XÓA Size %s:
                           - Số lượng: %d cái
                           - Giá bán: %s""",
                        sizeName, oldSize.getQuantity(), formatPrice(oldSize.getPrice())));
                hasSizeChanges = true;
                oldTotalQty += oldSize.getQuantity();
                oldTotalValue = oldTotalValue.add(BigDecimal.valueOf(oldSize.getPrice() * oldSize.getQuantity()));
            } else if (oldSize != null && newSize != null &&
                    (!Objects.equals(oldSize.getQuantity(), newSize.getQuantity()) ||
                            !Objects.equals(oldSize.getPrice(), newSize.getPrice()))) {

                StringBuilder changes = new StringBuilder();
                if (!Objects.equals(oldSize.getQuantity(), newSize.getQuantity())) {
                    int diff = newSize.getQuantity() - oldSize.getQuantity();
                    changes.append(String.format("    - Số lượng: %d → %d cái (%s%d)\n",
                            oldSize.getQuantity(), newSize.getQuantity(),
                            diff > 0 ? "+" : "", diff));
                }
                if (!Objects.equals(oldSize.getPrice(), newSize.getPrice())) {
                    int diff = newSize.getPrice() - oldSize.getPrice();
                    changes.append(String.format("       - Giá bán: %s → %s (%s%s)",
                            formatPrice(oldSize.getPrice()), formatPrice(newSize.getPrice()),
                            diff > 0 ? "+" : "", formatPrice(Math.abs(diff))));
                }

                if (changes.length() > 0) {
                    logMessage.append(String.format("""

                            ✏️ Size %s:
                            %s""", sizeName, changes));
                    hasSizeChanges = true;
                }

                oldTotalQty += oldSize.getQuantity();
                newTotalQty += newSize.getQuantity();
                oldTotalValue = oldTotalValue.add(BigDecimal.valueOf(oldSize.getPrice() * oldSize.getQuantity()));
                newTotalValue = newTotalValue.add(BigDecimal.valueOf(newSize.getPrice() * newSize.getQuantity()));
            }
        }

        if (hasSizeChanges) {
            int qtyDiff = newTotalQty - oldTotalQty;
            BigDecimal valueDiff = newTotalValue.subtract(oldTotalValue);

            logMessage.append(String.format("""

                       📊 TỔNG KẾT THAY ĐỔI:
                    - Tổng số lượng: %d → %d cái (%s%d)
                      -Tổng giá trị: %s → %s
                       -Chênh lệch: %s%s""",
                    oldTotalQty, newTotalQty,
                    qtyDiff >= 0 ? "+" : "", Math.abs(qtyDiff),
                    formatPrice(oldTotalValue), formatPrice(newTotalValue),
                    valueDiff.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "",
                    formatPrice(valueDiff.abs())));
        } else {
            logMessage.append("\n💡 Không có thay đổi về kích cỡ và giá");
        }

        return logMessage.toString();
    }

    // Create detailed log message for product deletion
    private String createDeleteLogMessage(String adminUsername, Product product) {
        StringBuilder logMessage = new StringBuilder();

        // Get category name safely - check both category and category name for null
        String categoryName = "Chưa phân loại";
        if (product.getCategorie() != null && product.getCategorie().getName() != null &&
                !product.getCategorie().getName().trim().isEmpty()) {
            categoryName = product.getCategorie().getName();
        }

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
                categoryName));

        // Add size-specific information with preloaded size names
        if (product.getSizes() != null && !product.getSizes().isEmpty()) {
            // Preload all size names at once
            Map<Integer, String> sizeNameCache = preloadSizeNames(product.getSizes());

            logMessage.append("\nChi tiết kích cỡ đã xóa:");
            for (ProductSize size : product.getSizes()) {
                logMessage.append(String.format("""

                        ✦ Size: %s
                          - Số lượng: %d cái
                          - Giá: %s""",
                        getSizeNameFromCache(size, sizeNameCache),
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

    private String formatDetailedChange(String field, String oldValue, String newValue) {
        return String.format("""

                - %s:
                │  - Cũ: %s
                │  - Mới: %s""",
                field,
                oldValue != null ? oldValue : "Không có",
                newValue != null ? newValue : "Không có");
    }
}
