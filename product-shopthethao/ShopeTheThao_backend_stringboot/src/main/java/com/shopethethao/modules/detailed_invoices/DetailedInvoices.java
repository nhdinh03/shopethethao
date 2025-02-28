package com.shopethethao.modules.detailed_invoices;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shopethethao.modules.invoices.Invoice;
import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.size.Size;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Detailed_Invoices")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailedInvoices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT IDENTITY(1,1)")
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "invoice_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "FK_DetailedInvoices_Invoice_New"))
    @JsonBackReference
    private Invoice invoice;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "FK_DetailedInvoices_Product_New"))
    private Product product;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "size_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "FK_DetailedInvoices_Size"))
    private Size size;

    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false, precision = 18, scale = 2, columnDefinition = "DECIMAL(18,2) DEFAULT 0.00")
    private BigDecimal unitPrice;

    @Column(name = "payment_method", nullable = false, length = 200)
    private String paymentMethod;
}
