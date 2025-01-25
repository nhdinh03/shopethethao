package com.shopethethao.modules.invoices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface InvoiceDAO extends JpaRepository<Invoice, String> {
    
}
