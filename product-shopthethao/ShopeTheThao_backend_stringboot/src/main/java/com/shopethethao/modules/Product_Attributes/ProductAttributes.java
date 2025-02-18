package com.shopethethao.modules.product_Attributes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.product_Attribute_Mappings.ProductAttributeMappings;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "Product_Attributes")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProductAttributes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String name;

    @OneToMany(mappedBy = "attribute", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // ✅ Ngăn vòng lặp khi trả về danh sách attributes
    private List<ProductAttributeMappings> productMappings;
}
