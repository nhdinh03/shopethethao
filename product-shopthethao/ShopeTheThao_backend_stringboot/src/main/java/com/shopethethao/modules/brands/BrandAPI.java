package com.shopethethao.modules.brands;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/brands")
public class BrandAPI {

  @Autowired
  private BrandDAO brandsDAO;

  @GetMapping("/get/all")
  public ResponseEntity<List<Brand>> findAll() {
    List<Brand> brands = brandsDAO.findAll();
    return ResponseEntity.ok(brands);
  }
}