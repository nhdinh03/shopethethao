package com.shopethethao.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StockReceiptRequestDTO {
    @NotNull(message = "Supplier ID là bắt buộc")
    private Integer supplierId;

    @NotNull(message = "Brand ID là bắt buộc")
    private Integer brandId;

     @JsonFormat(pattern = "yyyy-MM-dd") 
    @NotNull(message = "Ngày nhập kho là bắt buộc")
    private LocalDate orderDate;

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    
    private List<ReceiptProductRequestDTO> receiptProducts;
}
