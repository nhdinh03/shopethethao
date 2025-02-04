package com.shopethethao.modules.Size;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/size")
public class SizeAPI {

    @Autowired
    private SizeDAO SizeDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<Size>> findAll() {
        List<Size> sizes = SizeDAO.findAll();
        return ResponseEntity.ok(sizes);
    }

}
