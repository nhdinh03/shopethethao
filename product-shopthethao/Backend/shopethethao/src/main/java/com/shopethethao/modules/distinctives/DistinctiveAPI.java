package com.shopethethao.modules.distinctives;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/distinctives")
public class DistinctiveAPI {

    @Autowired
    DistinctiveDAO distinctivesDAO;

    @GetMapping("/getAll")
    public ResponseEntity<List<Distinctive>> findAll() {
        List <Distinctive> distinctives = distinctivesDAO.findAll();
        return ResponseEntity.ok(distinctives);
    }
    
    
}
