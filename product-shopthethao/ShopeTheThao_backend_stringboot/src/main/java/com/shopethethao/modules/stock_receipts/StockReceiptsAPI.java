package com.shopethethao.modules.stock_receipts;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/stockReceipts")
public class StockReceiptsAPI {

    @Autowired
    StockReceiptsDAO stockReceiptsDAO;

    @GetMapping("/getAll")
    public ResponseEntity<List<StockReceipt>> findAll() {
        List<StockReceipt> stockReceipts = stockReceiptsDAO.findAll();
        return ResponseEntity.ok(stockReceipts);
    }

}
