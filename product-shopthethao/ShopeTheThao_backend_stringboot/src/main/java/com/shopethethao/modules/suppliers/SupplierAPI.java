package com.shopethethao.modules.suppliers;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.shopethethao.modules.userHistory.UserHistoryService;
import com.shopethethao.modules.userHistory.UserActionType;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierAPI {

    private static final Logger logger = LoggerFactory.getLogger(SupplierAPI.class);

    @Autowired
    private SupplierDAO supplierDao;

    @Autowired
    private UserHistoryService userHistoryService;

    // Fetch all suppliers without pagination
    @GetMapping("/get/all")
    public ResponseEntity<List<Supplier>> findAll() {
        List<Supplier> suppliers = supplierDao.findAll();
        return ResponseEntity.ok(suppliers);
    }

    // Fetch suppliers with pagination
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Page not found", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Supplier> page = supplierDao.findAll(pageable);

            ResponseDTO<Supplier> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {

            return new ResponseEntity<>("Server error, please try again later!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new supplier
    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Supplier savedSupplier = supplierDao.save(supplier);
            
            // Create detailed log message with admin info
            String logMessage = String.format("""
                    ADMIN: %s đã thêm nhà cung cấp mới
                    Chi tiết:
                    - Tên nhà cung cấp: %s
                    - Số điện thoại: %s
                    - Email: %s
                    - Địa chỉ: %s""",
                    authentication.getName(),
                    supplier.getName(),
                    supplier.getPhoneNumber(),
                    supplier.getEmail() != null ? supplier.getEmail() : "Không có",
                    supplier.getAddress() != null ? supplier.getAddress() : "Không có");

            // Log user action
            userHistoryService.logUserAction(
                authentication.getName(),
                UserActionType.CREATE_SUPPLIER,
                logMessage,
                getClientIp(request),
                getClientInfo(request)
            );
            
            return ResponseEntity.ok(savedSupplier);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi tạo nhà cung cấp!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing supplier
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable("id") Integer id,
            @RequestBody Supplier supplier, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Supplier> optionalSupplier = supplierDao.findById(id);
            if (optionalSupplier.isPresent()) {
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

                    // Create detailed change log
                    String changeLog = String.format("""
                            ADMIN: %s đã cập nhật nhà cung cấp #%d
                            Chi tiết thay đổi:
                            %s""",
                            authentication.getName(),
                            id,
                            String.join(System.lineSeparator(), changes));

                    // Log the admin action
                    userHistoryService.logUserAction(
                        authentication.getName(),
                        UserActionType.UPDATE_SUPPLIER,
                        changeLog,
                        getClientIp(request),
                        getClientInfo(request)
                    );

                    return ResponseEntity.ok(updatedSupplier);
                } else {
                    return new ResponseEntity<>("Không có thay đổi nào được thực hiện!", HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>("Nhà cung cấp không tồn tại!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi cập nhật nhà cung cấp!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable("id") Integer id, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Supplier> existingSupplier = supplierDao.findById(id);
            if (existingSupplier.isPresent()) {
                Supplier supplier = existingSupplier.get();
                
                // Create detailed log message
                String logMessage = String.format("""
                        ADMIN: %s đã xóa nhà cung cấp
                        Chi tiết:
                        - ID: %d
                        - Tên nhà cung cấp: %s
                        - Số điện thoại: %s
                        - Email: %s
                        - Địa chỉ: %s""",
                        authentication.getName(),
                        id,
                        supplier.getName(),
                        supplier.getPhoneNumber(),
                        supplier.getEmail() != null ? supplier.getEmail() : "Không có",
                        supplier.getAddress() != null ? supplier.getAddress() : "Không có");

                // Perform deletion
                supplierDao.deleteById(id);
                
                // Log user action
                userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.DELETE_SUPPLIER,
                    logMessage,
                    getClientIp(request),
                    getClientInfo(request)
                );
                
                return ResponseEntity.ok(String.format("ADMIN: %s đã xóa nhà cung cấp '%s' thành công!",
                        authentication.getName(), supplier.getName()));
            } else {
                return new ResponseEntity<>("Nhà cung cấp không tồn tại!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi xóa nhà cung cấp!", HttpStatus.INTERNAL_SERVER_ERROR);
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
