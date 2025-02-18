package com.shopethethao.modules.stock_receipts;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.server.ResponseStatusException;

import com.shopethethao.dto.ReceiptProductDTO;
import com.shopethethao.dto.ReceiptProductRequestDTO;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.dto.StockReceiptDTO;
import com.shopethethao.dto.StockReceiptRequestDTO;
import com.shopethethao.modules.brands.Brand;
import com.shopethethao.modules.brands.BrandDAO;
import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.products.ProductsDAO;
import com.shopethethao.modules.receipt_Products.ReceiptProduct;
import com.shopethethao.modules.receipt_Products.ReceiptProductDAO;
import com.shopethethao.modules.receipt_Products.ReceiptProductPK;
import com.shopethethao.modules.suppliers.Supplier;
import com.shopethethao.modules.suppliers.SupplierDAO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stockReceipts")
public class StockReceiptsAPI {

    private static final Logger logger = LoggerFactory.getLogger(StockReceiptsAPI.class);

    @Autowired
    private StockReceiptsDAO stockReceiptsDAO;

    @Autowired
    private ReceiptProductDAO receiptProductDAO;

    @Autowired
    private SupplierDAO supplierDAO;

    @Autowired
    private BrandDAO brandDAO;

    @Autowired
    private ProductsDAO productsDAO;

    // Helper method to handle errors uniformly
    private ResponseEntity<String> handleError(String message, HttpStatus status) {
        logger.error(message);
        return new ResponseEntity<>(message, status);
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<StockReceipt>> findAll() {
        List<StockReceipt> stockReceipts = stockReceiptsDAO.findAll();
        return ResponseEntity.ok(stockReceipts);
    }

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            int page = pageNo.orElse(1) - 1;
            int size = limit.orElse(10);
            if (page < 0) {
                return handleError("Trang không hợp lệ, phải bắt đầu từ trang 1.", HttpStatus.BAD_REQUEST);
            }
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("id")));
            Page<StockReceipt> pageResult = stockReceiptsDAO.findAll(pageable);

            List<StockReceiptDTO> stockReceiptDTOs = pageResult.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Tạo đối tượng ResponseDTO chứa dữ liệu phân trang
            ResponseDTO<StockReceiptDTO> responseDTO = new ResponseDTO<>();
            responseDTO.setData(stockReceiptDTOs);
            responseDTO.setTotalItems(pageResult.getTotalElements());
            responseDTO.setTotalPages(pageResult.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return handleError("Lỗi máy chủ, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Phương thức chuyển đổi StockReceipt thành StockReceiptDTO
    private StockReceiptDTO convertToDTO(StockReceipt stockReceipt) {
        StockReceiptDTO dto = new StockReceiptDTO();
        dto.setId(stockReceipt.getId());
        dto.setSupplierName(stockReceipt.getSupplier().getName());
        dto.setSupplierId(stockReceipt.getSupplier().getId());
        dto.setBrandId(stockReceipt.getBrand().getId());
        dto.setBrandName(stockReceipt.getBrand().getName());
        dto.setOrderDate(stockReceipt.getOrderDate());

        // Chuyển đổi ReceiptProduct thành ReceiptProductDTO
        List<ReceiptProductDTO> receiptProductDTOs = stockReceipt.getReceiptProducts().stream()
                .map(this::convertReceiptProductToDTO)
                .collect(Collectors.toList());

        dto.setReceiptProducts(receiptProductDTOs);
        return dto;
    }

    // Phương thức chuyển đổi ReceiptProduct thành ReceiptProductDTO
    private ReceiptProductDTO convertReceiptProductToDTO(ReceiptProduct receiptProduct) {
        ReceiptProductDTO dto = new ReceiptProductDTO();
        dto.setProductId(receiptProduct.getProduct().getId());
        dto.setProductName(receiptProduct.getProduct().getName());
        dto.setQuantity(receiptProduct.getQuantity());
        dto.setPrice(receiptProduct.getPrice());
        dto.setTotalAmount(receiptProduct.getTotalAmount());
        return dto;
    }

    // ✅ Tạo phiếu nhập kho
    @Transactional
    @PostMapping
    public ResponseEntity<?> createStockReceipt(@RequestBody StockReceiptRequestDTO request) {
        try {
            if (request.getSupplierId() == null || request.getBrandId() == null || request.getOrderDate() == null) {
                return handleError("Thông tin 'supplier_id', 'brand_id', và 'order_date' là bắt buộc.",
                        HttpStatus.BAD_REQUEST);
            }

            Optional<Supplier> supplier = supplierDAO.findById(request.getSupplierId());
            Optional<Brand> brand = brandDAO.findById(request.getBrandId());

            if (supplier.isEmpty()) {
                return handleError("Supplier không tồn tại với ID: " + request.getSupplierId(), HttpStatus.BAD_REQUEST);
            }

            if (brand.isEmpty()) {
                return handleError("Brand không tồn tại với ID: " + request.getBrandId(), HttpStatus.BAD_REQUEST);
            }

            StockReceipt stockReceipt = new StockReceipt();
            stockReceipt.setSupplier(supplier.get());
            stockReceipt.setBrand(brand.get());
            LocalDate orderDate = request.getOrderDate();
            stockReceipt.setOrderDate(orderDate);

            stockReceipt.setReceiptProducts(new ArrayList<>());

            StockReceipt savedStockReceipt = stockReceiptsDAO.save(stockReceipt);

            // Xử lý ReceiptProducts
            for (ReceiptProductRequestDTO productRequest : request.getReceiptProducts()) {
                if (productRequest.getProductId() == null || productRequest.getQuantity() == null
                        || productRequest.getPrice() == null) {
                    return handleError("Thông tin 'product_id', 'quantity', và 'price' là bắt buộc.",
                            HttpStatus.BAD_REQUEST);
                }

                Optional<Product> product = productsDAO.findById(productRequest.getProductId());
                if (product.isEmpty()) {
                    return handleError("Sản phẩm không tồn tại với ID: " + productRequest.getProductId(),
                            HttpStatus.BAD_REQUEST);
                }

                ReceiptProduct receiptProduct = new ReceiptProduct();
                receiptProduct.setProduct(product.get());
                receiptProduct.setQuantity(productRequest.getQuantity());
                receiptProduct.setPrice(productRequest.getPrice());
                receiptProduct.setTotalAmount(
                        receiptProduct.getPrice().multiply(BigDecimal.valueOf(receiptProduct.getQuantity())));
                receiptProduct.setStockReceipt(savedStockReceipt);

                ReceiptProductPK productPK = new ReceiptProductPK();
                productPK.setReceiptId(savedStockReceipt.getId());
                productPK.setProductId(productRequest.getProductId());
                receiptProduct.setId(productPK);

                receiptProductDAO.save(receiptProduct);
                savedStockReceipt.getReceiptProducts().add(receiptProduct);
            }

            stockReceiptsDAO.save(savedStockReceipt);

            return ResponseEntity.ok(savedStockReceipt);
        } catch (Exception e) {
            return handleError("Lỗi khi tạo phiếu nhập kho!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStockReceipt(@PathVariable("id") Integer id,
            @Valid @RequestBody StockReceiptRequestDTO request) {
        try {
            StockReceipt existingStockReceipt = stockReceiptsDAO.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Phiếu nhập không tồn tại với ID: " + id));

            Supplier supplier = supplierDAO.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Không tìm thấy nhà cung cấp với ID: " + request.getSupplierId()));
            Brand brand = brandDAO.findById(request.getBrandId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Không tìm thấy thương hiệu với ID: " + request.getBrandId()));

            existingStockReceipt.setSupplier(supplier);
            existingStockReceipt.setBrand(brand);
            existingStockReceipt.setOrderDate(request.getOrderDate());

            // Clear existing receipt products
            receiptProductDAO.deleteByStockReceiptId(existingStockReceipt.getId());
            existingStockReceipt.getReceiptProducts().clear();

            // Add new receipt products
            for (ReceiptProductRequestDTO productRequest : request.getReceiptProducts()) {
                Product product = productsDAO.findById(productRequest.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Sản phẩm không tồn tại với ID: " + productRequest.getProductId()));

                ReceiptProduct receiptProduct = new ReceiptProduct();
                
                // Set the composite key
                ReceiptProductPK productPK = new ReceiptProductPK();
                productPK.setReceiptId(existingStockReceipt.getId());
                productPK.setProductId(productRequest.getProductId());
                receiptProduct.setId(productPK);

                // Set other properties
                receiptProduct.setStockReceipt(existingStockReceipt);
                receiptProduct.setProduct(product);
                receiptProduct.setQuantity(productRequest.getQuantity());
                receiptProduct.setPrice(productRequest.getPrice());
                receiptProduct.setTotalAmount(
                        receiptProduct.getPrice().multiply(BigDecimal.valueOf(receiptProduct.getQuantity())));

                // Save the new receipt product
                receiptProduct = receiptProductDAO.save(receiptProduct);
                existingStockReceipt.getReceiptProducts().add(receiptProduct);
            }

            // Save the updated stock receipt
            stockReceiptsDAO.save(existingStockReceipt);

            return ResponseEntity.ok(existingStockReceipt);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        } catch (Exception e) {
            logger.error("Error updating stock receipt", e);
            return handleError("Lỗi khi cập nhật phiếu nhập kho: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ Xóa phiếu nhập kho
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStockReceipt(@PathVariable("id") Integer id) {
        Optional<StockReceipt> existingReceipt = stockReceiptsDAO.findById(id);
        if (existingReceipt.isPresent()) {
            stockReceiptsDAO.deleteById(id);
            return ResponseEntity.ok("Xóa phiếu nhập thành công!");
        } else {
            return handleError("Phiếu nhập không tồn tại!", HttpStatus.NOT_FOUND);
        }
    }
}
