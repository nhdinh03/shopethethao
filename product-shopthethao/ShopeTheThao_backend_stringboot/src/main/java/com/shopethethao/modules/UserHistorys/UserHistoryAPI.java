package com.shopethethao.modules.UserHistorys;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/userHistories")
public class UserHistoryAPI {

      @Autowired
      UserHistoryDAO userHistoriesDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<UserHistory>> findAll() {
        List <UserHistory> userHistories = userHistoriesDAO.findAll();
        return ResponseEntity.ok(userHistories);
    }
    
}
