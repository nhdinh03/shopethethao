package com.shopethethao.modules.detailed_invoices;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/detailedInvoices")
public class DetailedInvoicesAPI {

    @Autowired
    private DetailedInvoicesDAO detailedInvoicesDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<DetailedInvoices>> findAll() {
        List<DetailedInvoices> detailedInvoices = detailedInvoicesDAO.findAll();
        return ResponseEntity.ok(detailedInvoices);
    }

    // API lấy chi tiết hóa đơn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DetailedInvoices> findById(@PathVariable Integer id) {
        Optional<DetailedInvoices> detailedInvoice = detailedInvoicesDAO.findById(id);

        if (detailedInvoice.isPresent()) {
            return ResponseEntity.ok(detailedInvoice.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
