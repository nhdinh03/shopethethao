package com.shopethethao.modules.stock_receipts;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.shopethethao.modules.brands.Brand;
import com.shopethethao.modules.receipt_Products.ReceiptProduct;
import com.shopethethao.modules.suppliers.Supplier;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Stock_Receipts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT IDENTITY(1,1)")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    @Column(name = "order_date", nullable = false, columnDefinition = "DATE DEFAULT GETDATE()")
    private LocalDate order_date;

    @OneToMany(mappedBy = "stockReceipt", orphanRemoval = true)
    @JsonManagedReference
    private List<ReceiptProduct> receiptProducts;

    

}
