package com.shopethethao.modules.suppliers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.service.AdminLogService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierAPI {

    private static final Logger logger = LoggerFactory.getLogger(SupplierAPI.class);

    @Autowired
    private SupplierDAO supplierDao;

    @Autowired
    private AdminLogService adminLogService;

    // Fetch all suppliers without pagination
    @GetMapping("/get/all")
    public ResponseEntity<List<Supplier>> findAll() {
        List<Supplier> suppliers = supplierDao.findAll();
        return ResponseEntity.ok(suppliers);
    }

    // Fetch suppliers with pagination and search
    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("search") Optional<String> search) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            
            Page<Supplier> page;
            if (search.isPresent() && !search.get().trim().isEmpty()) {
                page = supplierDao.searchSuppliers(search.get().trim(), pageable);
            } else {
                page = supplierDao.findAll(pageable);
            }

            ResponseDTO<Supplier> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            logger.error("Error fetching suppliers", e);
            return new ResponseEntity<>("Lỗi server, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new supplier
    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // Validate required fields
            if (supplier.getName() == null || supplier.getName().trim().isEmpty()) {
                String errorMessage = "Tên nhà cung cấp không được để trống!";
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "THÊM THẤT BẠI: " + errorMessage,
                    "SUPPLIER");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            }

            Supplier savedSupplier = supplierDao.save(supplier);
            
            String logMessage = String.format("""
                    Thêm nhà cung cấp mới:
                    - Mã: %d
                    - Tên nhà cung cấp: %s
                    - Số điện thoại: %s
                    - Email: %s
                    - Địa chỉ: %s""",
                    savedSupplier.getId(),
                    savedSupplier.getName(),
                    savedSupplier.getPhoneNumber(),
                    savedSupplier.getEmail() != null ? savedSupplier.getEmail() : "Không có",
                    savedSupplier.getAddress() != null ? savedSupplier.getAddress() : "Không có");

            adminLogService.logAdminAction(
                authentication.getName(),
                request,
                logMessage,
                "SUPPLIER");
            
            Map<String, Object> response = new HashMap<>();
            response.put("supplier", savedSupplier);
            response.put("message", "Thêm nhà cung cấp thành công");
            response.put("createdBy", authentication.getName());
            response.put("createdAt", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMessage = "Không thể tạo nhà cung cấp: " + e.getMessage();
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "SUPPLIER");
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing supplier
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(
            @PathVariable("id") Integer id,
            @RequestBody Supplier supplier, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Supplier> optionalSupplier = supplierDao.findById(id);
            if (optionalSupplier.isEmpty()) {
                String errorMessage = String.format("Nhà cung cấp #%d không tồn tại!", id);
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "CẬP NHẬT THẤT BẠI: " + errorMessage,
                    "SUPPLIER");
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            Supplier existingSupplier = optionalSupplier.get();
            List<String> changes = new ArrayList<>();

            // Track changes with detailed formatting
            if (!existingSupplier.getName().equals(supplier.getName())) {
                changes.add(String.format("- Tên nhà cung cấp:%n  + Cũ: '%s'%n  + Mới: '%s'",
                    existingSupplier.getName(), supplier.getName()));
                existingSupplier.setName(supplier.getName());
            }

            if (!existingSupplier.getPhoneNumber().equals(supplier.getPhoneNumber())) {
                changes.add(String.format("- Số điện thoại:%n  + Cũ: '%s'%n  + Mới: '%s'",
                    existingSupplier.getPhoneNumber(), supplier.getPhoneNumber()));
                existingSupplier.setPhoneNumber(supplier.getPhoneNumber());
            }

            if (!Objects.equals(existingSupplier.getEmail(), supplier.getEmail())) {
                changes.add(String.format("- Email:%n  + Cũ: '%s'%n  + Mới: '%s'",
                    existingSupplier.getEmail() != null ? existingSupplier.getEmail() : "Không có",
                    supplier.getEmail() != null ? supplier.getEmail() : "Không có"));
                existingSupplier.setEmail(supplier.getEmail());
            }

            if (!Objects.equals(existingSupplier.getAddress(), supplier.getAddress())) {
                changes.add(String.format("- Địa chỉ:%n  + Cũ: '%s'%n  + Mới: '%s'",
                    existingSupplier.getAddress() != null ? existingSupplier.getAddress() : "Không có",
                    supplier.getAddress() != null ? supplier.getAddress() : "Không có"));
                existingSupplier.setAddress(supplier.getAddress());
            }

            if (!changes.isEmpty()) {
                Supplier updatedSupplier = supplierDao.save(existingSupplier);

                String changeLog = String.format("""
                    Cập nhật nhà cung cấp #%d:
                    %s""",
                    id,
                    String.join(System.lineSeparator(), changes));

                adminLogService.logAdminAction(
                    authentication.getName(),
                    request,
                    changeLog,
                    "SUPPLIER");

                Map<String, Object> response = new HashMap<>();
                response.put("supplier", updatedSupplier);
                response.put("changes", changes);
                response.put("updateTime", LocalDateTime.now());
                response.put("updatedBy", authentication.getName());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.ok("Không có thay đổi nào được thực hiện!");
            }
        } catch (Exception e) {
            String errorMessage = String.format("Lỗi khi cập nhật nhà cung cấp #%d: %s", id, e.getMessage());
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "SUPPLIER");
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(
            @PathVariable("id") Integer id, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Supplier> existingSupplier = supplierDao.findById(id);
            if (existingSupplier.isEmpty()) {
                String errorMessage = String.format("Nhà cung cấp #%d không tồn tại!", id);
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "XÓA THẤT BẠI: " + errorMessage,
                    "SUPPLIER");
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            Supplier supplier = existingSupplier.get();
            String logMessage = String.format("""
                Xóa nhà cung cấp:
                - Mã: %d
                - Tên nhà cung cấp: %s
                - Số điện thoại: %s
                - Email: %s
                - Địa chỉ: %s""",
                id,
                supplier.getName(),
                supplier.getPhoneNumber(),
                supplier.getEmail() != null ? supplier.getEmail() : "Không có",
                supplier.getAddress() != null ? supplier.getAddress() : "Không có");

            supplierDao.deleteById(id);
            
            adminLogService.logAdminAction(
                authentication.getName(),
                request,
                logMessage,
                "SUPPLIER");

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Xóa nhà cung cấp thành công");
            response.put("deletedBy", authentication.getName());
            response.put("deletedAt", LocalDateTime.now());
            response.put("supplierInfo", supplier);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMessage = String.format("Lỗi khi xóa nhà cung cấp #%d: %s", id, e.getMessage());
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "SUPPLIER");
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private String getClientInfo(HttpServletRequest request) {
        return request.getHeader("User-Agent");
    }

}
