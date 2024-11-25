package com.shopethethao.modules.stock_receipts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockReceiptsDAO extends JpaRepository<StockReceipt,String>{
    
}
