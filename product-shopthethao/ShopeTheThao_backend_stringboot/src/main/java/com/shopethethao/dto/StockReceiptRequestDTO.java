package com.shopethethao.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class StockReceiptRequestDTO {
     private Integer supplierId;  // ID của Supplier
    private Integer brandId;     // ID của Brand
    private LocalDate orderDate; // Ngày nhập kho
    private List<ReceiptProductRequestDTO> receiptProducts;
}
