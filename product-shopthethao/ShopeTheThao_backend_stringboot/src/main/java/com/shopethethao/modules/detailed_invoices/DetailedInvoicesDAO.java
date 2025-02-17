package com.shopethethao.modules.detailed_invoices;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailedInvoicesDAO extends JpaRepository <DetailedInvoices, Integer> {
    List<DetailedInvoices> findAll();

    List<DetailedInvoices> findByInvoiceId(Integer id);
}
