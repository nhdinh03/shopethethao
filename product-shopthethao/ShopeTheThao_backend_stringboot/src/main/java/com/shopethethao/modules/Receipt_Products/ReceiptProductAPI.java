package com.shopethethao.modules.Receipt_Products;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.modules.stock_receipts.StockReceipt;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/receiptproduct")
public class ReceiptProductAPI {

    @Autowired
    private ReceiptProductDAO receiptProductDAO;

    

  @GetMapping("/get/all")
    public ResponseEntity<List<ReceiptProduct>> findAll() {
        List<ReceiptProduct> stockReceipts = receiptProductDAO.findAll();
        return ResponseEntity.ok(stockReceipts);
    }

}
