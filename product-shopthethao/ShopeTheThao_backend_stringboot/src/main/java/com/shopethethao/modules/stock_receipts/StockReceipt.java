package com.shopethethao.modules.stock_receipts;

import java.sql.Date;


import com.shopethethao.modules.brands.Brand;
import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.suppliers.Supplier;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Stock_Receipts")
public class StockReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

	private int quantity;

	private float price;

	@Temporal(TemporalType.DATE)
	private Date orderDate;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

	@ManyToOne
	@JoinColumn(name = "brand_id")
	private Brand brand;

}
