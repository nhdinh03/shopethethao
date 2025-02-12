package com.shopethethao.modules.stock_receipts;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.shopethethao.modules.Receipt_Products.ReceiptProduct;
import com.shopethethao.modules.brands.Brand;
import com.shopethethao.modules.suppliers.Supplier;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Data
@Table(name = "stock_receipts")
public class StockReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @JsonFormat(pattern = "yyyy-MM-dd") 
    @Temporal(TemporalType.DATE)
    private LocalDate orderDate;

    @OneToMany(mappedBy = "stockReceipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Tránh vòng lặp khi serialize
    private List<ReceiptProduct> receiptProducts;

}
