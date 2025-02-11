package com.shopethethao.modules.lock_reasons;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.stock_receipts.StockReceipt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lock_reasons")
public class LockReasons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    @JsonBackReference 
    private Account account;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(name = "created_at", nullable = false)
    private Date createdAt; // Use java.util.Date for consistency with the rest of the application

}
