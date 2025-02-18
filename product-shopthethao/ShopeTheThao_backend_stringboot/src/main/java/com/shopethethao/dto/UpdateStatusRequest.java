package com.shopethethao.dto;

import com.shopethethao.modules.invoices.InvoiceStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private InvoiceStatus status;
    private Integer cancelReasonId;
    private String note;
}
