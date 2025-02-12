package com.shopethethao.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReceiptProductRequestDTO {
    @NotNull(message = "Product ID là bắt buộc")
    private Integer productId;  // ID của sản phẩm

    @NotNull(message = "Số lượng là bắt buộc")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;   // Số lượng

    @NotNull(message = "Giá là bắt buộc")
    @DecimalMin(value = "0.01", message = "Giá phải lớn hơn 0")
    private BigDecimal price;   // Giá
}
