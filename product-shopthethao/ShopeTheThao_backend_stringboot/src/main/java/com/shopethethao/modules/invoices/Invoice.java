package com.shopethethao.modules.invoices;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.cancelReason.CancelReason;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @Column(name = "note", length = 200)
    private String note;

    @Column(name = "totalAmount", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cancel_reason_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_invoice_cancel_reason"), nullable = true)
    private CancelReason cancelReason;
    
    

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "fk_invoice_user"))
    private Account user;

    @PrePersist
    protected void onCreate() {
        if (this.orderDate == null) {
            this.orderDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = InvoiceStatus.PENDING;
        }
        if (this.totalAmount == null) {
            this.totalAmount = BigDecimal.ZERO;
        }
    }
}
