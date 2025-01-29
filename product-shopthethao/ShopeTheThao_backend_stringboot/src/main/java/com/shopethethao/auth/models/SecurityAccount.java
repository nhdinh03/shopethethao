package com.shopethethao.auth.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.accountRole.AccountRole;
import com.shopethethao.modules.verification.Verifications;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "Accounts")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecurityAccount {

    @Id
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;
    @Column(name = "fullname", nullable = false)
    private String fullname;

    private String address;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    private Date birthday;
    private Boolean gender;
    private String image;
    private Integer status;
    @Column(name = "created_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;
    private boolean verified;
    private int points;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "Accounts_Roles", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<SecurityRole> roles = new HashSet<>();

    @JsonIgnore
    @OneToOne(mappedBy = "securityAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Verifications verification;

    // @JsonIgnore
    // @OneToMany(mappedBy = "account")
    // private List<AccountRole> accountRoles;

    public SecurityAccount(String id, String phone, String fullname, String email, String password) {
        this.id = id;
        this.phone = phone;
        this.fullname = fullname;
        this.email = email;
        this.password = password;

    }

}
