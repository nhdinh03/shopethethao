package com.shopethethao.modules.categories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/categorie")
public class CategorieAPI {
    @Autowired
    private CategorieDAO categorieDao;

    @GetMapping("/getAll")
    public ResponseEntity<List<Categorie>> findAll() {
        List<Categorie> categories = categorieDao.findAll();
        return ResponseEntity.ok(categories);
    }
}
