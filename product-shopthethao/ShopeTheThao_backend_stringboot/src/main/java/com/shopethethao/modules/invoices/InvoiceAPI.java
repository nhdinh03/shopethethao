package com.shopethethao.modules.invoices;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceAPI {

    @Autowired
    InvoiceDAO invoiceDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<Invoice>> findAll() {
        List<Invoice> invoices = invoiceDAO.findAll();
        return ResponseEntity.ok(invoices);
    }

}
