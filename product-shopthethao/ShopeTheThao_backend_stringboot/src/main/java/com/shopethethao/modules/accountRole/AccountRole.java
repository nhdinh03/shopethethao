package com.shopethethao.modules.accountRole;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.role.Role;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Accounts_Roles")
public class AccountRole {

    @EmbeddedId
    private AccountRolePK id; // Sử dụng khóa chính tổng hợp

    @ManyToOne
    @MapsId("accountId") // Ánh xạ với account_id trong AccountRolePK
    @JoinColumn(name = "account_id", 
                foreignKey = @ForeignKey(name = "FK_AccountsRoles_Account"))
    private Account account;

    @ManyToOne
    @MapsId("roleId") // Ánh xạ với role_id trong AccountRolePK
    @JoinColumn(name = "role_id",
                foreignKey = @ForeignKey(name = "FK_AccountsRoles_Role"))
    private Role role;

}
