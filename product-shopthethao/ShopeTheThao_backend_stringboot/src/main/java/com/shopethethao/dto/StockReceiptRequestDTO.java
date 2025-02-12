package com.shopethethao.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockReceiptRequestDTO {
    @NotNull(message = "Supplier ID là bắt buộc")
    private Integer supplierId;

    @NotNull(message = "Brand ID là bắt buộc")
    private Integer brandId;

    @NotNull(message = "Ngày nhập kho là bắt buộc")
    private LocalDate orderDate;

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    
    private List<ReceiptProductRequestDTO> receiptProducts;
}
