package com.shopethethao.modules.accountRole;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor

public class AccountRolePK implements Serializable {

    @Column(name = "account_id", insertable = false, updatable = false)
    private String accountID;

    @Column(name = "role_id", insertable = false, updatable = false)
    private Long roleID;

}
