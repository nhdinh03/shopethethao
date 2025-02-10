package com.shopethethao.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class StockReceiptDTO {
    
    private Integer id;
    private String supplierName;
    private String brandName;
    private LocalDate orderDate;
    private List<ReceiptProductDTO> receiptProducts;
}
