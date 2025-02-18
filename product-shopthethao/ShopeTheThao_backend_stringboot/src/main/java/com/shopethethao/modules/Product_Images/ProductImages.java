package com.shopethethao.modules.Product_Images;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import lombok.Data;

@Entity
@Table(name = "Product_Images")
@Data
public class ProductImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false,
                foreignKey = @ForeignKey(name = "FK_ProductImages_Product"))
    @JsonBackReference
    private Product product;
}
