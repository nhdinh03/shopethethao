package com.shopethethao.dto;

import com.shopethethao.modules.invoices.InvoiceStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private InvoiceStatus status;
    private String note;
    private Integer cancelReasonId;
}
