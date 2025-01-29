package com.shopethethao.modules.detailed_invoices;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

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

}
