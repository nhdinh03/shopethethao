package com.shopethethao.modules.products;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.shopethethao.modules.categories.Categorie;
import com.shopethethao.modules.productSizes.ProductSize;
import com.shopethethao.modules.product_Attribute_Mappings.ProductAttributeMappings;
import com.shopethethao.modules.product_Images.ProductImages;
import com.shopethethao.modules.receipt_Products.ReceiptProduct;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
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

@Entity
@Table(name = "Products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private int quantity;

    @Column(precision = 18, scale = 2)
    private BigDecimal price;

    private String description;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false,referencedColumnName = "id" ,
                foreignKey = @ForeignKey(name = "FK_Products_Category"))
    private Categorie categorie;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProductAttributeMappings> attributeMappings;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductSize> sizes;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductImages> images;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReceiptProduct> receiptProducts;

}
