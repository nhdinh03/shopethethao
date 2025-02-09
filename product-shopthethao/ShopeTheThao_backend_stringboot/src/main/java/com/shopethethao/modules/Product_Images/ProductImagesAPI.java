package com.shopethethao.modules.Product_Images;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productimages")
public class ProductImagesAPI {
    
    @Autowired
    private ProductImagesDAO productImagesDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<ProductImages>> findAll() {
        List<ProductImages> images = productImagesDAO.findAllByOrderByIdDesc();
        return ResponseEntity.ok(images);
    }
}
