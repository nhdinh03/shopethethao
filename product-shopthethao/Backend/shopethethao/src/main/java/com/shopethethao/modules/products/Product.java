package com.shopethethao.modules.products;

import java.util.List;
import java.util.Locale.Category;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.categories.Categorie;
import com.shopethethao.modules.comments.Comment;
import com.shopethethao.modules.detailed_invoices.DetailedInvoices;
import com.shopethethao.modules.products_distinctives.ProductsDistinctives;

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
	private String id;
	private String name;

	private int quantity;

	private float price;

	private String description;

	private boolean status;

	private String image1;

	private String image2;

	@ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Categorie categorie;
	
	// @OneToMany(mappedBy = "product")
	// @JsonIgnore
	// private List<Comment> comments;

	// @OneToMany(mappedBy = "product")
	// @JsonIgnore
	// private List<DetailedInvoices> detailedInvoices;

	

	@OneToMany(mappedBy = "product")
	@JsonIgnore
	private List<ProductsDistinctives> productDistinctives;

	// constructors, getters, and setters
}