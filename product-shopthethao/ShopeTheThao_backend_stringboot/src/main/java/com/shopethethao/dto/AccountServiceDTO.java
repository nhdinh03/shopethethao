package com.shopethethao.dto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopethethao.modules.account.AccountDAO;



@Service
public class AccountServiceDTO {

    @Autowired
    private AccountDAO accountDao;


    public void deleteAccount(String id) {

        accountDao.deleteById(id);
    }
}
