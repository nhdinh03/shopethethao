package com.shopethethao.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class DetailedInvoicesDTO {
        private Integer id;
    private Integer invoiceId;
    private Integer productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private String paymentMethod;
    private List<String> productImages; // Add this field

}
