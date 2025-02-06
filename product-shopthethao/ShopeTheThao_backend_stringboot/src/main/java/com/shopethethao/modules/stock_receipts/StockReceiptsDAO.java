package com.shopethethao.modules.stock_receipts;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface StockReceiptsDAO extends JpaRepository<StockReceipt, Integer> {
    @Query("SELECT s FROM StockReceipt s LEFT JOIN FETCH s.product p LEFT JOIN FETCH s.supplier su LEFT JOIN FETCH s.brand b WHERE s.id = :id")
    Optional<StockReceipt> findByIdWithDetails(@Param("id") Integer id);
    

}
