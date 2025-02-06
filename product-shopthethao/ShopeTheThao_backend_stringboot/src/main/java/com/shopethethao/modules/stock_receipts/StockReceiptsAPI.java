package com.shopethethao.modules.stock_receipts;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shopethethao.dto.ResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/stockReceipts")
public class StockReceiptsAPI {

    private static final Logger logger = LoggerFactory.getLogger(StockReceiptsAPI.class);

    @Autowired
    private StockReceiptsDAO stockReceiptsDAO;

    // ✅ Lấy danh sách tất cả phiếu nhập kho
    @GetMapping("/get/all")
    public ResponseEntity<List<StockReceipt>> findAll() {
        List<StockReceipt> stockReceipts = stockReceiptsDAO.findAll();
        return ResponseEntity.ok(stockReceipts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockReceipt> getProductById(@PathVariable Integer id) {
        Optional<StockReceipt> product = stockReceiptsDAO.findByIdWithDetails(id);
        return product.isPresent() ? ResponseEntity.ok(product.get()) : ResponseEntity.notFound().build();
    }


    // ✅ Lấy danh sách phiếu nhập kho có phân trang
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<StockReceipt> page = stockReceiptsDAO.findAll(pageable);
            ResponseDTO<StockReceipt> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách phiếu nhập kho: ", e);
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ Tạo phiếu nhập kho
    @PostMapping
    public ResponseEntity<?> createStockReceipt(@RequestBody StockReceipt stockReceipt) {
        try {
            StockReceipt savedStockReceipt = stockReceiptsDAO.save(stockReceipt);
            return ResponseEntity.ok(savedStockReceipt);
        } catch (Exception e) {
            logger.error("Lỗi khi tạo phiếu nhập kho: ", e);
            return new ResponseEntity<>("Lỗi khi tạo phiếu nhập kho!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ Cập nhật phiếu nhập kho
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
