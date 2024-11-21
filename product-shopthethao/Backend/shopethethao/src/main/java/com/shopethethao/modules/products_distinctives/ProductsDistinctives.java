package com.shopethethao.modules.products_distinctives;

import com.shopethethao.modules.categories.Categorie;
import com.shopethethao.modules.distinctives.Distinctives;
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
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;


    @ManyToOne
    @JoinColumn(name = "distinctive_id", nullable = false)
    private Distinctives distinctive;
}