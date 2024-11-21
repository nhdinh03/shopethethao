package com.shopethethao.modules.accountRole;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.role.Role;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Accounts_Roles")
@Data
public class AccountRole {

    @EmbeddedId
    private AccountRolePK accountRolePK;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Role role;
}