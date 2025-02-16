package com.shopethethao.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class InvoiceListDTO {
    // private Integer id;
    private String invoiceId;
    private LocalDateTime orderDate;
    private String address;
    private String status;
    private BigDecimal totalAmount;
    private String customerName;
    private String cancelReason;
}
