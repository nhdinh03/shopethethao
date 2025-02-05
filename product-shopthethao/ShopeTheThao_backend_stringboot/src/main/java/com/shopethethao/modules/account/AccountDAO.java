package com.shopethethao.modules.account;

import java.awt.print.Pageable;

import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shopethethao.dto.AccountDTO;

@Repository
public interface AccountDAO extends JpaRepository<Account, String> {
;
}
