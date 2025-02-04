package com.shopethethao.modules.products;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.shopethethao.modules.categories.Categorie;
import com.shopethethao.modules.productSizes.ProductSize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false, precision = 18, scale = 2)
    private BigDecimal price;

    @Column(name = "description")
    private String description;

    @Column(name = "status", nullable = false)
    private boolean status;

    @Column(name = "image1")
    private String image1;

    @Column(name = "image2")
    private String image2;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Categorie categorie;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference // Ensure no recursive relationship
    private List<ProductSize> sizes;
}


