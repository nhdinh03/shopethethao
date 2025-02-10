package com.shopethethao.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ReceiptProductDTO {
    
    private Integer productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalAmount;
}
