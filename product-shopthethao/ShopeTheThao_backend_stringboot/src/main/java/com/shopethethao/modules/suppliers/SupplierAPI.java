package com.shopethethao.modules.suppliers;

import java.util.List;
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

@RestController
@RequestMapping("/api/suppliers")
public class SupplierAPI {

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
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier, HttpServletRequest request) {
        try {
            Supplier savedSupplier = supplierDao.save(supplier);
            String userId = getCurrentUserId();
            if (userId != null) {
                StringBuilder details = new StringBuilder();
                details.append(String.format("Tên: '%s', ", supplier.getName()));
                details.append(String.format("Số điện thoại: '%s', ", supplier.getPhoneNumber()));
                
                if (supplier.getEmail() != null) {
                    details.append(String.format("Email: '%s', ", supplier.getEmail()));
                }
                if (supplier.getAddress() != null) {
                    details.append(String.format("Địa chỉ: '%s', ", supplier.getAddress()));
                }
                
                // Remove trailing comma and space
                String detailLog = details.substring(0, details.length() - 2);
                
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.CREATE_SUPPLIER,
                    "Tạo mới nhà cung cấp - " + detailLog,
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent")
                );
            }
            return ResponseEntity.ok(savedSupplier);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi tạo nhà cung cấp!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing supplier
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable("id") Integer id,
            @RequestBody Supplier supplier, HttpServletRequest request) {
        try {
            Optional<Supplier> optionalSupplier = supplierDao.findById(id);
            if (optionalSupplier.isPresent()) {
                Supplier existingSupplier = optionalSupplier.get();
                StringBuilder changes = new StringBuilder();

                // Track name changes
                if (!existingSupplier.getName().equals(supplier.getName())) {
                    changes.append(String.format("Tên: '%s' thành '%s', ", 
                        existingSupplier.getName(), supplier.getName()));
                    existingSupplier.setName(supplier.getName());
                }

                // Track phone number changes
                if (!existingSupplier.getPhoneNumber().equals(supplier.getPhoneNumber())) {
                    changes.append(String.format("Số điện thoại: '%s' thành '%s', ", 
                        existingSupplier.getPhoneNumber(), supplier.getPhoneNumber()));
                    existingSupplier.setPhoneNumber(supplier.getPhoneNumber());
                }

                // Track email changes
                if ((existingSupplier.getEmail() == null && supplier.getEmail() != null) ||
                    (existingSupplier.getEmail() != null && !existingSupplier.getEmail().equals(supplier.getEmail()))) {
                    changes.append(String.format("Email: '%s' thành '%s', ", 
                        existingSupplier.getEmail(), supplier.getEmail()));
                    existingSupplier.setEmail(supplier.getEmail());
                }

                // Track address changes
                if ((existingSupplier.getAddress() == null && supplier.getAddress() != null) ||
                    (existingSupplier.getAddress() != null && !existingSupplier.getAddress().equals(supplier.getAddress()))) {
                    changes.append(String.format("Địa chỉ: '%s' thành '%s', ", 
                        existingSupplier.getAddress(), supplier.getAddress()));
                    existingSupplier.setAddress(supplier.getAddress());
                }

                // If there are any changes, save and log them
                if (changes.length() > 0) {
                    // Remove trailing comma and space
                    String changeLog = changes.substring(0, changes.length() - 2);
                    
                    Supplier updatedSupplier = supplierDao.save(existingSupplier);
                    String userId = getCurrentUserId();
                    if (userId != null) {
                        userHistoryService.logUserAction(
                            userId,
                            UserActionType.UPDATE_SUPPLIER,
                            "Cập nhật nhà cung cấp - " + changeLog,
                            request.getRemoteAddr(),
                            request.getHeader("User-Agent")
                        );
                    }
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
    public ResponseEntity<?> deleteSupplier(@PathVariable("id") Integer id, HttpServletRequest request) {
        try {
            Optional<Supplier> existingSupplier = supplierDao.findById(id);
            if (existingSupplier.isPresent()) {
                Supplier supplier = existingSupplier.get();
                
                // Build detailed log before deletion
                StringBuilder details = new StringBuilder();
                details.append(String.format("Tên: '%s', ", supplier.getName()));
                details.append(String.format("Số điện thoại: '%s', ", supplier.getPhoneNumber()));
                
                if (supplier.getEmail() != null) {
                    details.append(String.format("Email: '%s', ", supplier.getEmail()));
                }
                if (supplier.getAddress() != null) {
                    details.append(String.format("Địa chỉ: '%s', ", supplier.getAddress()));
                }
                
                // Remove trailing comma and space
                String detailLog = details.substring(0, details.length() - 2);

                // Perform deletion
                supplierDao.deleteById(id);
                
                String userId = getCurrentUserId();
                if (userId != null) {
                    userHistoryService.logUserAction(
                        userId,
                        UserActionType.DELETE_SUPPLIER,
                        "Xóa nhà cung cấp - " + detailLog,
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent")
                    );
                }
                return ResponseEntity.ok("Xóa nhà cung cấp thành công!");
            } else {
                return new ResponseEntity<>("Nhà cung cấp không tồn tại!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi xóa nhà cung cấp!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }
}
