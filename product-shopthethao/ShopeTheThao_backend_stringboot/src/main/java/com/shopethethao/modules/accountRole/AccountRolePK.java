package com.shopethethao.modules.accountRole;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class AccountRolePK implements Serializable {

    @Column(name = "account_id")
    private Integer accountId;

    @Column(name = "role_id")
    private Long roleId;
}
