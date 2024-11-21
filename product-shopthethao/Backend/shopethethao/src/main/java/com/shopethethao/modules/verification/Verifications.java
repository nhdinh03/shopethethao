package com.shopethethao.modules.verification;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import com.shopethethao.modules.account.Account;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Verification")
public class Verifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private String id;
    
  

    @Column(name = "code", length = 6)
    private String code;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "expires_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiresAt;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

  
}