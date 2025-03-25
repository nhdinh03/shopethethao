package com.shopethethao.modules.stock_receipts;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface StockReceiptsDAO extends JpaRepository<StockReceipt, Integer> {
    // @Query("SELECT s FROM StockReceipt s LEFT JOIN FETCH s.product p LEFT JOIN
    // FETCH s.supplier su LEFT JOIN FETCH s.brand b WHERE s.id = :id")
    // Optional<StockReceipt> findByIdWithDetails(@Param("id") Integer id);

    List<StockReceipt> findBySupplierId(int supplierId);

    List<StockReceipt> findByBrandId(int brandId);

    @Query("SELECT DISTINCT s FROM StockReceipt s " +
           "LEFT JOIN s.supplier sup " +
           "LEFT JOIN s.brand b " +
           "LEFT JOIN s.receiptProducts rp " +
           "LEFT JOIN rp.product p " +
           "WHERE (:searchText IS NULL OR " +
           "LOWER(sup.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "CAST(s.id AS string) LIKE CONCAT('%', :searchText, '%') OR " +
           "FORMAT(s.order_date, 'dd/MM/yyyy') LIKE CONCAT('%', :searchText, '%'))")
    Page<StockReceipt> searchStockReceipts(@Param("searchText") String searchText, Pageable pageable);
}
