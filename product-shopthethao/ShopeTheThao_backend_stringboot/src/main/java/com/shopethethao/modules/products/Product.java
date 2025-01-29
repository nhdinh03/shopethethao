package com.shopethethao.modules.products;

import com.shopethethao.modules.categories.Categorie;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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
}
