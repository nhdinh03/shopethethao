package com.shopethethao.modules.accountRole;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.role.Role;


public interface AccountRoleDAO extends JpaRepository<AccountRole, AccountRolePK> {

        Optional<AccountRole> findByAccountAndRole(Account account, Role role);

}


