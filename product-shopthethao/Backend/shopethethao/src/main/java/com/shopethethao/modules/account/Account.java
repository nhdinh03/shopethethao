package com.shopethethao.modules.account;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.accountRole.AccountRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "Accounts")
@Data
public class Account {
    @Id
    private String id;
    private String phone;
    private String fullname;

    private String address;

    private String email;
    private String password;
    private Date birthday;
    private Boolean gender;
    private String image;
    private Integer status;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_date")
    private Date createdDate;
    private Boolean verified;
    private int points;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<AccountRole> accountRole;
    

}
