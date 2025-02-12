package com.shopethethao.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class StockReceiptDTO {

    private Integer id;
    private String supplierName;
    private String brandName;
    private Integer brandId;
    private Integer supplierId;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate orderDate;

    private List<ReceiptProductDTO> receiptProducts;
}
