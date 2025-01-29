package com.shopethethao.modules.accountRole;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accountRole")
public class AccountRoleAPI {

    @Autowired
    AccountRoleDAO accountRoleDao;

    @GetMapping("/get/all")
    public ResponseEntity<List<AccountRole>> findAll() {
        List<AccountRole> accountRoles = accountRoleDao.findAll();
        return ResponseEntity.ok(accountRoles);
    }

}
