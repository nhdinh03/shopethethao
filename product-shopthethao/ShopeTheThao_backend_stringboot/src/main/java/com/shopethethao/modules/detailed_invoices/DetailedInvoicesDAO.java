package com.shopethethao.modules.detailed_invoices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailedInvoicesDAO extends JpaRepository <DetailedInvoices, Integer> {
    
}
