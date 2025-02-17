package com.shopethethao.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
    private String cancelReason; // Thêm lý do hủy hàng
    private List<DetailedInvoicesDTO> detailedInvoices;
}
