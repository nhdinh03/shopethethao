package com.shopethethao.modules.distinctives;

import java.util.List;
import java.util.Locale.Category;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.comments.Comment;
import com.shopethethao.modules.invoices.Invoice;
import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.products_distinctives.ProductsDistinctives;

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
@Table(name = "Distinctives")
public class Distinctive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private String id;

	private String name;

	// @OneToMany(mappedBy = "distinctive")
	// @JsonIgnore
	// private List<ProductsDistinctives> productDistinctives;

}
