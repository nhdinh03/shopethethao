package com.shopethethao.auth.models;

import java.util.List;
import java.util.Set;

import org.springframework.boot.autoconfigure.security.saml2.Saml2RelyingPartyProperties.AssertingParty.Verification;

import java.util.Date;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.accountRole.AccountRole;
import com.shopethethao.modules.verification.Verifications;

import jakarta.persistence.*;
import lombok.Data;

@Table(name = "Accounts")
// @Entity
// @Table(name = "Accounts", uniqueConstraints = {
// @UniqueConstraint(columnNames = "id"),
// @UniqueConstraint(columnNames = "email")
// })
@Entity
@Data
public class SecurityAccount {
    @Id
    @Column(name = "id", nullable = false)
    private String id;
    private String phone;
    private String fullname;
    private String address;
    @Column(nullable = false, unique = true) 
    private String email;
    private String password;
    private Date birthday;
    private Boolean gender;
    private String image;
    private Integer status;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_date")
    private Date createdDate;
    private boolean verified;
    private int points;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "Accounts_Roles", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<SecurityRole> roles = new HashSet<>();

    @JsonIgnore
    @OneToOne(mappedBy = "securityAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Verifications verification;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<AccountRole> accountRoles;

    public SecurityAccount() {

    }

    public SecurityAccount(String id, String phone, String fullname, String email, String password) {
        this.id = id;
        this.phone = phone;
        this.fullname = fullname;
        this.email = email;
        this.password = password;

    }

}
