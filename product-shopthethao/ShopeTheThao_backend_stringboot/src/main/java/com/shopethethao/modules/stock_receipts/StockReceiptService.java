package com.shopethethao.modules.stock_receipts;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockReceiptService {
      @Autowired
    private StockReceiptsDAO stockReceiptRepository;

    public List<StockReceipt> getAllStockReceipts() {
        return stockReceiptRepository.findAll();
    }
}
