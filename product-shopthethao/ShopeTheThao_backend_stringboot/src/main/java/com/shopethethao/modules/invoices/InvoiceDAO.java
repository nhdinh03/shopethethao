package com.shopethethao.modules.invoices;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceDAO extends JpaRepository<Invoice, Integer> {
    @Query("SELECT i FROM Invoice i WHERE i.status = :status ORDER BY i.orderDate DESC")
    List<Invoice> findByStatus(@Param("status") InvoiceStatus status);


}
