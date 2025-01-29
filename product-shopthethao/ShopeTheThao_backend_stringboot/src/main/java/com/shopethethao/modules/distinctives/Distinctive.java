package com.shopethethao.modules.distinctives;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.products_distinctives.ProductsDistinctives;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Distinctives")
public class Distinctive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @OneToMany(mappedBy = "distinctive", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ProductsDistinctives> productDistinctives;
}
