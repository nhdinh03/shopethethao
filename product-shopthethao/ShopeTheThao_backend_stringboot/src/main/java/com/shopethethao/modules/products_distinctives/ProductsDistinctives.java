package com.shopethethao.modules.products_distinctives;

import org.springframework.stereotype.Service;

import com.shopethethao.modules.distinctives.Distinctive;
import com.shopethethao.modules.invoices.Invoice;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Products_Distinctives")
public class ProductsDistinctives {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "distinctive_id", referencedColumnName = "id", nullable = false)
    private Distinctive distinctive;

}
