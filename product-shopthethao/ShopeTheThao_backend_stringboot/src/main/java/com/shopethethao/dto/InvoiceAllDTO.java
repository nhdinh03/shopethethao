package com.shopethethao.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class InvoiceAllDTO {
    private Integer id;
    private LocalDateTime orderDate;
    private String address;
    private String status;
    private String note;
    private BigDecimal totalAmount;
    private String userId;
}
