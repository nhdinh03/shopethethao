package com.shopethethao.modules.invoices;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.InvoiceAllDTO;
import com.shopethethao.dto.InvoiceListDTO;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceAPI {

    @Autowired
    InvoiceDAO invoiceDAO;

    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        try {
            List<InvoiceAllDTO> invoices = invoiceDAO.findAll().stream()
                .map(invoice -> {
                    InvoiceAllDTO dto = new InvoiceAllDTO();
                    dto.setId(invoice.getId());
                    dto.setOrderDate(invoice.getOrderDate());
                    dto.setAddress(invoice.getAddress());
                    dto.setStatus(invoice.getStatus().getDisplayName());
                    dto.setNote(invoice.getNote());
                    dto.setTotalAmount(invoice.getTotalAmount());
                    dto.setUserId(invoice.getUser().getId());
                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy danh sách hóa đơn: " + e.getMessage());
        }
    }


    @GetMapping("/pending")
    public ResponseEntity<?> getPendingInvoices() {
        try {
            List<InvoiceListDTO> invoices = invoiceDAO.findByStatus(InvoiceStatus.PENDING)
                .stream()
                .map(invoice -> convertToListDTO(invoice, true))
                .collect(Collectors.toList());
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy danh sách hóa đơn chờ xử lý: " + e.getMessage());
        }
    }

    @GetMapping("/shipping")
    public ResponseEntity<?> getShippingInvoices() {
        try {
            List<InvoiceListDTO> invoices = invoiceDAO.findByStatus(InvoiceStatus.SHIPPING)
                .stream()
                .map(invoice -> convertToListDTO(invoice, false))
                .collect(Collectors.toList());
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy danh sách hóa đơn đang giao: " + e.getMessage());
        }
    }

    @GetMapping("/delivered")
    public ResponseEntity<?> getDeliveredInvoices() {
        try {
            List<InvoiceListDTO> invoices = invoiceDAO.findByStatus(InvoiceStatus.DELIVERED)
                .stream()
                .map(invoice -> convertToListDTO(invoice, false))
                .collect(Collectors.toList());
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy danh sách hóa đơn đã giao: " + e.getMessage());
        }
    }

    @GetMapping("/cancelled")
    public ResponseEntity<?> getCancelledInvoices() {
        try {
            List<InvoiceListDTO> invoices = invoiceDAO.findByStatus(InvoiceStatus.CANCELLED)
                .stream()
                .map(invoice -> convertToListDTO(invoice, false))
                .collect(Collectors.toList());
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy danh sách hóa đơn đã hủy: " + e.getMessage());
        }
    }

    private InvoiceListDTO convertToListDTO(Invoice invoice, boolean includeCancelReason) {
        InvoiceListDTO dto = new InvoiceListDTO();
        dto.setInvoiceId("#" + invoice.getId());
        dto.setOrderDate(invoice.getOrderDate());
        dto.setStatus(invoice.getStatus().getDisplayName());
        dto.setCustomerName(invoice.getUser().getFullname());
        if (includeCancelReason && invoice.getStatus() == InvoiceStatus.CANCELLED) {
            dto.setCancelReason(invoice.getNote());
        }
        return dto;
    }
}


