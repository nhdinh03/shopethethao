package com.shopethethao.modules.productSizes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ProductSizes")
public class ProductSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String size; // Kích thước: S, M, L, XL hoặc 38, 39, 40

    @Column(nullable = false)
    private int quantity; // Số lượng theo size

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Product product;
}
