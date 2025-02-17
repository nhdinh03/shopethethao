package com.shopethethao.modules.detailed_invoices;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shopethethao.modules.invoices.Invoice;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Detailed_Invoices")
public class DetailedInvoices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "fk_detailed_invoice_invoice"))
    @JsonBackReference
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "fk_detailed_invoice_product"))
    private Product product;

    @Column(name = "quantity", nullable = false)
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private int quantity;

    @Column(name = "unitPrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "payment_method", nullable = false, length = 200)
    private String paymentMethod;

    @PrePersist
    protected void onCreate() {
        if (this.unitPrice == null) {
            this.unitPrice = BigDecimal.ZERO;
        }
    }
}
