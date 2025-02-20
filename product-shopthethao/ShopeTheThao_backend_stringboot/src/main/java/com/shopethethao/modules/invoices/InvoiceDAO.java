package com.shopethethao.modules.invoices;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceDAO extends JpaRepository<Invoice, Integer> {
    @Query("SELECT i FROM Invoice i WHERE i.status = :status ORDER BY i.orderDate DESC")
    Page<Invoice> findByStatus(@Param("status") InvoiceStatus status, Pageable pageable);
    

    // You can also use the Spring Data JPA method naming convention instead of
    // @Query
    // Page<Invoice> findByStatusOrderByOrderDateDesc(InvoiceStatus status, Pageable
    // pageable);
}