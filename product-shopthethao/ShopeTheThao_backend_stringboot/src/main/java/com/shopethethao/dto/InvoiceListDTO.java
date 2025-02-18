package com.shopethethao.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data@JsonInclude(JsonInclude.Include.NON_NULL)  
public class InvoiceListDTO {
    private String invoiceId;
    private LocalDateTime orderDate;
    private String address;
    private String status;
    private BigDecimal totalAmount;
    private String customerName;
    private String cancelReason;  
   
}
