package com.shopethethao.modules.user_Histories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.modules.distinctives.Distinctive;
import com.shopethethao.modules.distinctives.DistinctiveDAO;

@RestController
@RequestMapping("/api/userHistories")
public class UserHistoriesAPI {

      @Autowired
      UserHistoriesDAO userHistoriesDAO;

    @GetMapping("/getAll")
    public ResponseEntity<List<UserHistories>> findAll() {
        List <UserHistories> userHistories = userHistoriesDAO.findAll();
        return ResponseEntity.ok(userHistories);
    }
    
}
