package com.shopethethao.modules.invoices;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.cancelReason.CancelReason;
import com.shopethethao.modules.detailed_invoices.DetailedInvoices;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    @JoinColumn(name = "cancel_reason_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_Invoices_CancelReason"), nullable = true)
    private CancelReason cancelReason;
    
    @OneToMany(mappedBy = "invoice", fetch = FetchType.LAZY)
    private List<DetailedInvoices> detailedInvoices;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "FK_Invoices_User"))
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
