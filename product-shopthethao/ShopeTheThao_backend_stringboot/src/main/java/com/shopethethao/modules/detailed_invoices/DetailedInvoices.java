package com.shopethethao.modules.detailed_invoices;

import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.invoices.Invoice;

import jakarta.persistence.*;
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
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "id", nullable = false)
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "payment_method", nullable = false, length = 200)
    private String paymentMethod;
}
