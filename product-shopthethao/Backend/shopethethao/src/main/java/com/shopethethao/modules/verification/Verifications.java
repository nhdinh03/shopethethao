package com.shopethethao.modules.verification;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.auth.models.SecurityAccount;
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
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
	@JoinColumn(name = "account_id", referencedColumnName = "phone", insertable = false, updatable = false)
	private Account account;

	@JsonIgnore
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "account_id", referencedColumnName = "id", insertable = false, updatable = false)
	private SecurityAccount securityAccount;

  
}