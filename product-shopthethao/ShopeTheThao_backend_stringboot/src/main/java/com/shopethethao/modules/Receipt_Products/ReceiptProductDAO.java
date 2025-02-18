package com.shopethethao.modules.receipt_Products;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptProductDAO extends JpaRepository<ReceiptProduct, ReceiptProductPK> {
    List<ReceiptProduct> findByStockReceiptId(int stockReceiptId);
    List<ReceiptProduct> findByProductId(int productId);

     @Modifying
    @Query("DELETE FROM ReceiptProduct rp WHERE rp.stockReceipt.id = :stockReceiptId")
    void deleteByStockReceiptId(@Param("stockReceiptId") Integer stockReceiptId);
}
