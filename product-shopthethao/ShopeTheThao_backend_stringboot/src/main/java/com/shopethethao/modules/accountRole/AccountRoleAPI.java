package com.shopethethao.modules.accountRole;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/accountRole")
public class AccountRoleAPI {

    @Autowired
    AccountDAO accountDAO;

    @GetMapping("/getAll")
    public ResponseEntity<List<Account>> findAll() {
        List<Account> accounts = accountDAO.findAll();
        return ResponseEntity.ok(accounts);
    }

}
