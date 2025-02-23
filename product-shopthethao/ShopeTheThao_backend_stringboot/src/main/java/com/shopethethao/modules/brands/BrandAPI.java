package com.shopethethao.modules.brands;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.userHistory.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/brands")
public class BrandAPI {

    @Autowired
    private BrandDAO brandsDAO;

    @Autowired
    private UserHistoryService userHistoryService;

    // Fetch all brands without pagination
    @GetMapping("/get/all")
    public ResponseEntity<List<Brand>> findAll() {
        List<Brand> brands = brandsDAO.findAll();
        return ResponseEntity.ok(brands);
    }

    // Fetch brands with pagination
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Brand> page = brandsDAO.findAll(pageable);
            ResponseDTO<Brand> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new brand
    @PostMapping
    public ResponseEntity<?> createBrand(@RequestBody Brand brand, HttpServletRequest request) {
        try {
            Brand savedBrand = brandsDAO.save(brand);
            String userId = getCurrentUserId();
            if (userId != null) {
                StringBuilder details = new StringBuilder();
                details.append(String.format("Tên: '%s', ", brand.getName()));
                details.append(String.format("Số điện thoại: '%s', ", brand.getPhoneNumber()));
                
                if (brand.getEmail() != null) {
                    details.append(String.format("Email: '%s', ", brand.getEmail()));
                }
                if (brand.getAddress() != null) {
                    details.append(String.format("Địa chỉ: '%s', ", brand.getAddress()));
                }
                
                // Remove trailing comma and space
                String detailLog = details.substring(0, details.length() - 2);
                
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.CREATE_BRAND,
                    "Tạo mới thương hiệu - " + detailLog,
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent")
                );
            }
            return ResponseEntity.ok(savedBrand);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi tạo thương hiệu!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing brand
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable("id") Integer id,
            @RequestBody Brand brand, HttpServletRequest request) {
        Optional<Brand> optionalBrand = brandsDAO.findById(id);
        if (optionalBrand.isPresent()) {
            Brand existingBrand = optionalBrand.get();
            StringBuilder changes = new StringBuilder();

            // Track name changes
            if (!existingBrand.getName().equals(brand.getName())) {
                changes.append(String.format("Tên: '%s' thành '%s', ", 
                    existingBrand.getName(), brand.getName()));
                existingBrand.setName(brand.getName());
            }

            // Track phone number changes
            if (!existingBrand.getPhoneNumber().equals(brand.getPhoneNumber())) {
                changes.append(String.format("Số điện thoại: '%s' thành '%s', ", 
                    existingBrand.getPhoneNumber(), brand.getPhoneNumber()));
                existingBrand.setPhoneNumber(brand.getPhoneNumber());
            }

            // Track email changes
            if ((existingBrand.getEmail() == null && brand.getEmail() != null) ||
                (existingBrand.getEmail() != null && !existingBrand.getEmail().equals(brand.getEmail()))) {
                changes.append(String.format("Email: '%s' thành '%s', ", 
                    existingBrand.getEmail(), brand.getEmail()));
                existingBrand.setEmail(brand.getEmail());
            }

            // Track address changes
            if ((existingBrand.getAddress() == null && brand.getAddress() != null) ||
                (existingBrand.getAddress() != null && !existingBrand.getAddress().equals(brand.getAddress()))) {
                changes.append(String.format("Địa chỉ: '%s' thành '%s', ", 
                    existingBrand.getAddress(), brand.getAddress()));
                existingBrand.setAddress(brand.getAddress());
            }

            // If there are any changes, save and log them
            if (changes.length() > 0) {
                // Remove trailing comma and space
                String changeLog = changes.substring(0, changes.length() - 2);
                
                Brand updatedBrand = brandsDAO.save(existingBrand);
                String userId = getCurrentUserId();
                if (userId != null) {
                    userHistoryService.logUserAction(
                        userId,
                        UserActionType.UPDATE_BRAND,
                        "Cập nhật thương hiệu - " + changeLog,
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent")
                    );
                }
                return ResponseEntity.ok(updatedBrand);
            } else {
                return new ResponseEntity<>("Không có thay đổi nào được thực hiện!", HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>("Thương hiệu không tồn tại!", HttpStatus.NOT_FOUND);
        }
    }

    // Delete a brand
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable("id") Integer id, HttpServletRequest request) {
        Optional<Brand> existingBrand = brandsDAO.findById(id);
        if (existingBrand.isPresent()) {
            try {
                Brand brand = existingBrand.get();
                if (!brand.getStockReceipts().isEmpty()) {
                    return new ResponseEntity<>("Không thể xóa thương hiệu này vì đang có phiếu nhập kho liên quan!",
                            HttpStatus.CONFLICT);
                }

                // Build detailed log before deletion
                StringBuilder details = new StringBuilder();
                details.append(String.format("Tên: '%s', ", brand.getName()));
                details.append(String.format("Số điện thoại: '%s', ", brand.getPhoneNumber()));
                
                if (brand.getEmail() != null) {
                    details.append(String.format("Email: '%s', ", brand.getEmail()));
                }
                if (brand.getAddress() != null) {
                    details.append(String.format("Địa chỉ: '%s', ", brand.getAddress()));
                }
                
                // Remove trailing comma and space
                String detailLog = details.substring(0, details.length() - 2);

                // Perform deletion
                brandsDAO.deleteById(id);
                
                String userId = getCurrentUserId();
                if (userId != null) {
                    userHistoryService.logUserAction(
                        userId,
                        UserActionType.DELETE_BRAND,
                        "Xóa thương hiệu - " + detailLog,
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent")
                    );
                }

                return ResponseEntity.ok("Xóa thương hiệu thành công!");
            } catch (DataIntegrityViolationException e) {
                return new ResponseEntity<>("Không thể xóa thương hiệu này vì đang được sử dụng!", HttpStatus.CONFLICT);
            } catch (Exception e) {
                return new ResponseEntity<>("Lỗi khi xóa thương hiệu: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>("Thương hiệu không tồn tại!", HttpStatus.NOT_FOUND);
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
