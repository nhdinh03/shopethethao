package com.shopethethao.modules.products_distinctives;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.modules.detailed_invoices.DetailedInvoices;
import com.shopethethao.modules.detailed_invoices.DetailedInvoicesDAO;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/productsDistinctives")
public class ProductsDistinctivesAPI {

    @Autowired
    private ProductsDistinctivesDAO productsDistinctivesDAO;

    @GetMapping("/getAll")
    public ResponseEntity<List<ProductsDistinctives>> findAll() {
        List<ProductsDistinctives> productsDistinctives = productsDistinctivesDAO.findAll();
        return ResponseEntity.ok(productsDistinctives);
    }

}
