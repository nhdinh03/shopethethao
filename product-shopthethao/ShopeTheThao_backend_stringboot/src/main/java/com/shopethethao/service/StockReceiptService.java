package com.shopethethao.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopethethao.modules.stock_receipts.StockReceipt;
import com.shopethethao.modules.stock_receipts.StockReceiptsDAO;

@Service
public class StockReceiptService {
      @Autowired
    private StockReceiptsDAO stockReceiptRepository;

    public List<StockReceipt> getAllStockReceipts() {
        return stockReceiptRepository.findAll();
    }
}
