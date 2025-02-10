package com.shopethethao.modules.Receipt_Products;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptProductDAO extends JpaRepository<ReceiptProduct, ReceiptProductPK> {
    List<ReceiptProduct> findByStockReceiptId(int stockReceiptId);
    List<ReceiptProduct> findByProductId(int productId);
}
