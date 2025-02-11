package com.shopethethao.modules.stock_receipts;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

import com.shopethethao.dto.ReceiptProductDTO;
import com.shopethethao.dto.ReceiptProductRequestDTO;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.dto.StockReceiptDTO;
import com.shopethethao.dto.StockReceiptRequestDTO;
import com.shopethethao.modules.Receipt_Products.ReceiptProduct;
import com.shopethethao.modules.Receipt_Products.ReceiptProductDAO;
import com.shopethethao.modules.Receipt_Products.ReceiptProductPK;
import com.shopethethao.modules.brands.Brand;
import com.shopethethao.modules.brands.BrandDAO;
import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.products.ProductsDAO;
import com.shopethethao.modules.suppliers.Supplier;
import com.shopethethao.modules.suppliers.SupplierDAO;

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



    @GetMapping("/{id}")
    public ResponseEntity<StockReceipt> getProductById(@PathVariable Integer id) {
        Optional<StockReceipt> product = stockReceiptsDAO.findById(id);
        return product.isPresent() ? ResponseEntity.ok(product.get()) : ResponseEntity.notFound().build();
    }

    // ✅ Lấy danh sách phiếu nhập kho có phân trang
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            // Kiểm tra trang không hợp lệ
            if (pageNo.isPresent() && pageNo.get() < 1) {
                return new ResponseEntity<>("Trang không hợp lệ, phải bắt đầu từ trang 1.", HttpStatus.BAD_REQUEST);
            }

            // Xử lý phân trang
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);

            // Lấy dữ liệu phân trang từ cơ sở dữ liệu
            Page<StockReceipt> page = stockReceiptsDAO.findAll(pageable);

            // Chuyển đổi StockReceipt thành StockReceiptDTO
            List<StockReceiptDTO> stockReceiptDTOs = new ArrayList<>();
            for (StockReceipt stockReceipt : page.getContent()) {
                StockReceiptDTO dto = convertToDTO(stockReceipt);
                stockReceiptDTOs.add(dto);
            }

            // Tạo và trả về ResponseDTO với dữ liệu phân trang
            ResponseDTO<StockReceiptDTO> responseDTO = new ResponseDTO<>();
            responseDTO.setData(stockReceiptDTOs);
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách phiếu nhập kho: ", e);
            return new ResponseEntity<>("Lỗi máy chủ, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Phương thức chuyển đổi StockReceipt thành StockReceiptDTO
    private StockReceiptDTO convertToDTO(StockReceipt stockReceipt) {
        StockReceiptDTO dto = new StockReceiptDTO();
        dto.setId(stockReceipt.getId());
        dto.setSupplierName(stockReceipt.getSupplier().getName());
        dto.setBrandName(stockReceipt.getBrand().getName());
        dto.setOrderDate(stockReceipt.getOrderDate());

        // Chuyển đổi ReceiptProduct thành ReceiptProductDTO
        List<ReceiptProductDTO> receiptProductDTOs = new ArrayList<>();
        for (ReceiptProduct receiptProduct : stockReceipt.getReceiptProducts()) {
            ReceiptProductDTO receiptProductDTO = new ReceiptProductDTO();
            receiptProductDTO.setProductId(receiptProduct.getProduct().getId());
            receiptProductDTO.setProductName(receiptProduct.getProduct().getName());
            receiptProductDTO.setQuantity(receiptProduct.getQuantity());
            receiptProductDTO.setPrice(receiptProduct.getPrice());
            receiptProductDTO.setTotalAmount(receiptProduct.getTotalAmount());
            receiptProductDTOs.add(receiptProductDTO);
        }

        dto.setReceiptProducts(receiptProductDTOs);
        return dto;
    }

    // ✅ Tạo phiếu nhập kho
    @Transactional
    @PostMapping
    public ResponseEntity<?> createStockReceipt(@RequestBody StockReceiptRequestDTO request) {
        try {
            // Kiểm tra các giá trị không null cho supplier và brand
            if (request.getSupplierId() == null || request.getBrandId() == null || request.getOrderDate() == null) {
                return new ResponseEntity<>("Thông tin 'supplier_id', 'brand_id', và 'order_date' là bắt buộc.",
                        HttpStatus.BAD_REQUEST);
            }

            // Lấy thông tin Supplier và Brand từ cơ sở dữ liệu
            Optional<Supplier> supplier = supplierDAO.findById(request.getSupplierId());
            Optional<Brand> brand = brandDAO.findById(request.getBrandId());

            if (supplier.isEmpty()) {
                return new ResponseEntity<>("Supplier không tồn tại với ID: " + request.getSupplierId(),
                        HttpStatus.BAD_REQUEST);
            }

            if (brand.isEmpty()) {
                return new ResponseEntity<>("Brand không tồn tại với ID: " + request.getBrandId(),
                        HttpStatus.BAD_REQUEST);
            }

            // Tạo đối tượng StockReceipt từ request
            StockReceipt stockReceipt = new StockReceipt();
            stockReceipt.setSupplier(supplier.get());
            stockReceipt.setBrand(brand.get());
            stockReceipt.setOrderDate(request.getOrderDate());
            stockReceipt.setReceiptProducts(new ArrayList<>()); 

            // Lưu StockReceipt vào cơ sở dữ liệu
            StockReceipt savedStockReceipt = stockReceiptsDAO.save(stockReceipt);

            // Xử lý ReceiptProducts
            for (ReceiptProductRequestDTO productRequest : request.getReceiptProducts()) {
                // Kiểm tra nếu sản phẩm hợp lệ
                if (productRequest.getProductId() == null || productRequest.getQuantity() == null
                        || productRequest.getPrice() == null) {
                    return new ResponseEntity<>("Thông tin 'product_id', 'quantity', và 'price' là bắt buộc.",
                            HttpStatus.BAD_REQUEST);
                }

                // Lấy Product từ cơ sở dữ liệu
                Optional<Product> product = productsDAO.findById(productRequest.getProductId());
                if (product.isEmpty()) {
                    return new ResponseEntity<>("Sản phẩm không tồn tại với ID: " + productRequest.getProductId(),
                            HttpStatus.BAD_REQUEST);
                }

                // Tạo ReceiptProduct và gán giá trị
                ReceiptProduct receiptProduct = new ReceiptProduct();
                receiptProduct.setProduct(product.get());
                receiptProduct.setQuantity(productRequest.getQuantity());
                receiptProduct.setPrice(productRequest.getPrice());
                receiptProduct.setTotalAmount(
                        receiptProduct.getPrice().multiply(BigDecimal.valueOf(receiptProduct.getQuantity())));

                // Gán StockReceipt cho ReceiptProduct
                receiptProduct.setStockReceipt(savedStockReceipt);

                // Tạo khóa composite cho ReceiptProduct
                ReceiptProductPK productPK = new ReceiptProductPK();
                productPK.setReceiptId(savedStockReceipt.getId());
                productPK.setProductId(productRequest.getProductId());
                receiptProduct.setId(productPK);

                // Lưu ReceiptProduct vào cơ sở dữ liệu
                receiptProductDAO.save(receiptProduct);

                // Add the created ReceiptProduct to the list of receiptProducts in StockReceipt
                savedStockReceipt.getReceiptProducts().add(receiptProduct);
            }

            // Save the updated StockReceipt with the linked ReceiptProducts
            stockReceiptsDAO.save(savedStockReceipt);

            return ResponseEntity.ok(savedStockReceipt);
        } catch (Exception e) {
            logger.error("Lỗi khi tạo phiếu nhập kho: ", e);
            return new ResponseEntity<>("Lỗi khi tạo phiếu nhập kho!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStockReceipt(@PathVariable("id") Integer id,
            @RequestBody StockReceipt stockReceipt) {
        Optional<StockReceipt> existingReceipt = stockReceiptsDAO.findById(id);
        if (existingReceipt.isPresent()) {
            stockReceipt.setId(id);
            StockReceipt updatedStockReceipt = stockReceiptsDAO.save(stockReceipt);
            return ResponseEntity.ok(updatedStockReceipt);
        } else {
            return new ResponseEntity<>("Phiếu nhập không tồn tại!", HttpStatus.NOT_FOUND);
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
            return new ResponseEntity<>("Phiếu nhập không tồn tại!", HttpStatus.NOT_FOUND);
        }
    }
}
