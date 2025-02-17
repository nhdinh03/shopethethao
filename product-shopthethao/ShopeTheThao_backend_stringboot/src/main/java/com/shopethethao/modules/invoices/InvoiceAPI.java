package com.shopethethao.modules.invoices;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.DetailedInvoicesDTO;
import com.shopethethao.dto.InvoiceAllDTO;
import com.shopethethao.dto.InvoiceListDTO;
import com.shopethethao.modules.cancelReason.CancelReason;
import com.shopethethao.modules.cancelReason.CancelReasonDAO;
import com.shopethethao.modules.detailed_invoices.DetailedInvoicesDAO;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceAPI {

    @Autowired
    private InvoiceDAO invoiceDAO;

    @Autowired
    private CancelReasonDAO cancelReasonDAO;

    @Autowired
    private DetailedInvoicesDAO detailedInvoicesDAO;

    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        try {
            // Lấy tất cả hóa đơn từ database
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

                        // Lấy lý do hủy nếu có
                        dto.setCancelReason(
                                invoice.getCancelReason() != null ? invoice.getCancelReason().getReason() : null);

                        // Lấy chi tiết hóa đơn cho mỗi hóa đơn
                        List<DetailedInvoicesDTO> detailedInvoicesDTOs = detailedInvoicesDAO.findAll().stream()
                                .filter(detailedInvoice -> detailedInvoice.getInvoice().getId().equals(invoice.getId()))
                                .map(detailedInvoice -> {
                                    DetailedInvoicesDTO detailedDTO = new DetailedInvoicesDTO();
                                    detailedDTO.setId(detailedInvoice.getId());
                                    detailedDTO.setInvoiceId(detailedInvoice.getInvoice().getId());
                                    detailedDTO.setProductId(detailedInvoice.getProduct().getId());
                                    detailedDTO.setProductName(detailedInvoice.getProduct().getName());
                                    detailedDTO.setQuantity(detailedInvoice.getQuantity());
                                    detailedDTO.setUnitPrice(detailedInvoice.getUnitPrice());
                                    detailedDTO.setPaymentMethod(detailedInvoice.getPaymentMethod());
                                    return detailedDTO;
                                })
                                .collect(Collectors.toList());

                        dto.setDetailedInvoices(detailedInvoicesDTOs); // Set chi tiết hóa đơn vào DTO

                        return dto;
                    })
                    .collect(Collectors.toList()); // Thu thập kết quả thành danh sách

            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy danh sách hóa đơn: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Integer id) {
        try {
            // Find the invoice by its ID
            Invoice invoice = invoiceDAO.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));

            // Map the Invoice to InvoiceAllDTO
            InvoiceAllDTO dto = new InvoiceAllDTO();
            dto.setId(invoice.getId());
            dto.setOrderDate(invoice.getOrderDate());
            dto.setAddress(invoice.getAddress());
            dto.setStatus(invoice.getStatus().getDisplayName());
            dto.setNote(invoice.getNote());
            dto.setTotalAmount(invoice.getTotalAmount());
            dto.setUserId(invoice.getUser().getId());

            // Set the cancel reason if available
            dto.setCancelReason(invoice.getCancelReason() != null ? invoice.getCancelReason().getReason() : null);

            // Get the detailed invoices for this particular invoice
            List<DetailedInvoicesDTO> detailedInvoicesDTOs = detailedInvoicesDAO.findAll().stream()
                    .filter(detailedInvoice -> detailedInvoice.getInvoice().getId().equals(invoice.getId()))
                    .map(detailedInvoice -> {
                        DetailedInvoicesDTO detailedDTO = new DetailedInvoicesDTO();
                        detailedDTO.setId(detailedInvoice.getId());
                        detailedDTO.setInvoiceId(detailedInvoice.getInvoice().getId());
                        detailedDTO.setProductId(detailedInvoice.getProduct().getId());
                        detailedDTO.setProductName(detailedInvoice.getProduct().getName());
                        detailedDTO.setQuantity(detailedInvoice.getQuantity());
                        detailedDTO.setUnitPrice(detailedInvoice.getUnitPrice());
                        detailedDTO.setPaymentMethod(detailedInvoice.getPaymentMethod());
                        return detailedDTO;
                    })
                    .collect(Collectors.toList());

            dto.setDetailedInvoices(detailedInvoicesDTOs); // Set the detailed invoices into DTO

            return ResponseEntity.ok(dto); // Return the invoice details
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy chi tiết hóa đơn: " + e.getMessage());
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
        dto.setAddress(invoice.getAddress());
        dto.setTotalAmount(invoice.getTotalAmount());
        dto.setStatus(invoice.getStatus().getDisplayName());
        dto.setCustomerName(invoice.getUser().getFullname());

        // 🚀 Debug để kiểm tra dữ liệu có đúng không
        System.out.println("Convert DTO - Cancel Reason: "
                + (invoice.getCancelReason() != null ? invoice.getCancelReason().getReason() : "NULL"));

        // ✅ Cách đúng để hiển thị `cancelReason`
        dto.setCancelReason(invoice.getCancelReason() != null ? invoice.getCancelReason().getReason() : null);

        return dto;
    }

    // ✅ API cập nhật trạng thái hóa đơn
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoiceStatus(
            @PathVariable Integer id,
            @RequestParam InvoiceStatus status,
            @RequestParam(required = false) Integer cancelReasonId) {

        try {
            // 🚀 Tìm hóa đơn cần cập nhật
            Invoice invoice = invoiceDAO.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));

            // 🚀 Cập nhật trạng thái
            invoice.setStatus(status);

            // Nếu trạng thái là "CANCELLED", cần có lý do hủy
            if (status == InvoiceStatus.CANCELLED) {
                if (cancelReasonId == null) {
                    return ResponseEntity.badRequest().body("Vui lòng cung cấp lý do hủy.");
                }
                CancelReason cancelReason = cancelReasonDAO.findById(cancelReasonId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy lý do hủy với ID: " + cancelReasonId));
                invoice.setCancelReason(cancelReason);
            } else {
                // Nếu không phải "CANCELLED", xóa lý do hủy nếu có
                invoice.setCancelReason(null);
            }

            // 🚀 Lưu hóa đơn đã cập nhật
            invoiceDAO.save(invoice);
            return ResponseEntity.ok("Cập nhật trạng thái hóa đơn thành công.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật trạng thái hóa đơn: " + e.getMessage());
        }
    }
}
