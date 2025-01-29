package com.shopethethao.modules.products;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductsAPI {

    @Autowired
    ProductsDAO productsDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<Product>> findAll() {
        List<Product>products = productsDAO.findAll();
        return ResponseEntity.ok(products);
    }

}
