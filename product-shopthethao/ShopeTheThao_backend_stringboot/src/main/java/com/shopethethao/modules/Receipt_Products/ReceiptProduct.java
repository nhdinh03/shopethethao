package com.shopethethao.modules.Receipt_Products;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JoinColumn(name = "receipt_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonBackReference // Tránh vòng lặp vô hạn trong serialization
    private StockReceipt stockReceipt;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

}