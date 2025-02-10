package com.shopethethao.dto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import com.shopethethao.modules.account.AccountDAO;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Service
public class AccountServiceDTO {

    @Autowired
    private AccountDAO accountDao;


    public void deleteAccount(String id) {

        accountDao.deleteById(id);
    }
}
