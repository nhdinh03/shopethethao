package com.shopethethao.modules.verification;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.modules.distinctives.Distinctive;
import com.shopethethao.modules.distinctives.DistinctiveDAO;

@RestController
@RequestMapping("/api/verifications")
public class VerificationsAPI {

      @Autowired
      VerificationsDAO verificationsDAO;

    @GetMapping("/getAll")
    public ResponseEntity<List<Verifications>> findAll() {
        List <Verifications> distinctives = verificationsDAO.findAll();
        return ResponseEntity.ok(distinctives);
    }
    
}
