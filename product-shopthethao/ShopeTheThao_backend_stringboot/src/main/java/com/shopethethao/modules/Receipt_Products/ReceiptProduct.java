package com.shopethethao.modules.Receipt_Products;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.products.Product;
import com.shopethethao.modules.stock_receipts.StockReceipt;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Receipt_Products")
public class ReceiptProduct {

    @EmbeddedId
    private ReceiptProductPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("receiptId")
    @JoinColumn(name = "receipt_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_ReceiptProducts_Receipt_V2"))
    @JsonBackReference // Tránh vòng lặp khi serialize
    private StockReceipt stockReceipt;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_ReceiptProducts_Product_V2"))
    @JsonIgnore // Tránh serialize proxy Hibernate
    private Product product;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

}