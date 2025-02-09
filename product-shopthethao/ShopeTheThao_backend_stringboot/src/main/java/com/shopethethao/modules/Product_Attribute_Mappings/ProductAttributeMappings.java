package com.shopethethao.modules.Product_Attribute_Mappings;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.Product_Attributes.ProductAttributes;
import com.shopethethao.modules.products.Product;
import jakarta.persistence.*;
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
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference // ✅ Đánh dấu đây là phía "con"
    private Product product;

    @ManyToOne
    @JoinColumn(name = "attribute_id", referencedColumnName = "id", nullable = false)
    private ProductAttributes attribute;
}
