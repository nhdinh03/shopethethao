package com.shopethethao.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ReceiptProductRequestDTO {
    private Integer productId;  // ID của sản phẩm
    private Integer quantity;   // Số lượng
    private BigDecimal price;   // Giá
}
