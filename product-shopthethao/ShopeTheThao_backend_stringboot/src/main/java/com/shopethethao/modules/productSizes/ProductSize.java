package com.shopethethao.modules.productSizes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shopethethao.modules.Size.Size;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ProductSizes")
public class ProductSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private int quantity; // Số lượng theo size

    @Column(nullable = false)
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "size_id", referencedColumnName = "id", nullable = false)
    private Size size;

   
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product;
}
