package com.shopethethao.modules.Product_Attribute_Mappings;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shopethethao.modules.Product_Attributes.ProductAttributes;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.ForeignKey;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Product_Attribute_Mappings", uniqueConstraints = @UniqueConstraint(columnNames = { "product_id",
        "attribute_id" }))
public class ProductAttributeMappings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "FK_ProductAttributes_Product_New"))
    @JsonBackReference // ✅ Đánh dấu đây là phía "con"
    private Product product;

    @ManyToOne
    @JoinColumn(name = "attribute_id", referencedColumnName = "id", nullable = false, foreignKey = @ForeignKey(name = "FK_ProductAttributes_Attribute_New"))
    private ProductAttributes attribute;
}
