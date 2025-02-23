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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import java.util.Objects;

@RestController
@RequestMapping("/api/brands")
public class BrandAPI {

    private static final Logger logger = LoggerFactory.getLogger(BrandAPI.class);

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
    public ResponseEntity<?> createBrand(@RequestBody Brand brand, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Brand savedBrand = brandsDAO.save(brand);
            
            // Create detailed log message with admin info
            String logMessage = String.format("""
                    ADMIN: %s đã thêm thương hiệu mới
                    Chi tiết:
                    - Tên thương hiệu: %s
                    - Số điện thoại: %s
                    - Email: %s
                    - Địa chỉ: %s""",
                    authentication.getName(),
                    brand.getName(),
                    brand.getPhoneNumber(),
                    brand.getEmail() != null ? brand.getEmail() : "Không có",
                    brand.getAddress() != null ? brand.getAddress() : "Không có");

            userHistoryService.logUserAction(
                authentication.getName(),
                UserActionType.CREATE_BRAND,
                logMessage,
                getClientIp(request),
                getClientInfo(request)
            );
            
            return ResponseEntity.ok(savedBrand);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi tạo thương hiệu!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing brand
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable("id") Integer id,
            @RequestBody Brand brand, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Brand> optionalBrand = brandsDAO.findById(id);
            if (optionalBrand.isPresent()) {
                Brand existingBrand = optionalBrand.get();
                List<String> changes = new ArrayList<>();

                // Track changes with detailed formatting
                if (!existingBrand.getName().equals(brand.getName())) {
                    changes.add(String.format("- Tên thương hiệu:%n  + Cũ: '%s'%n  + Mới: '%s'",
                        existingBrand.getName(), brand.getName()));
                    existingBrand.setName(brand.getName());
                }

                if (!existingBrand.getPhoneNumber().equals(brand.getPhoneNumber())) {
                    changes.add(String.format("- Số điện thoại:%n  + Cũ: '%s'%n  + Mới: '%s'",
                        existingBrand.getPhoneNumber(), brand.getPhoneNumber()));
                    existingBrand.setPhoneNumber(brand.getPhoneNumber());
                }

                if (!Objects.equals(existingBrand.getEmail(), brand.getEmail())) {
                    changes.add(String.format("- Email:%n  + Cũ: '%s'%n  + Mới: '%s'",
                        existingBrand.getEmail() != null ? existingBrand.getEmail() : "Không có",
                        brand.getEmail() != null ? brand.getEmail() : "Không có"));
                    existingBrand.setEmail(brand.getEmail());
                }

                if (!Objects.equals(existingBrand.getAddress(), brand.getAddress())) {
                    changes.add(String.format("- Địa chỉ:%n  + Cũ: '%s'%n  + Mới: '%s'",
                        existingBrand.getAddress() != null ? existingBrand.getAddress() : "Không có",
                        brand.getAddress() != null ? brand.getAddress() : "Không có"));
                    existingBrand.setAddress(brand.getAddress());
                }

                if (!changes.isEmpty()) {
                    Brand updatedBrand = brandsDAO.save(existingBrand);

                    // Create detailed change log
                    String changeLog = String.format("""
                            ADMIN: %s đã cập nhật thương hiệu #%d
                            Chi tiết thay đổi:
                            %s""",
                            authentication.getName(),
                            id,
                            String.join(System.lineSeparator(), changes));

                    userHistoryService.logUserAction(
                        authentication.getName(),
                        UserActionType.UPDATE_BRAND,
                        changeLog,
                        getClientIp(request),
                        getClientInfo(request)
                    );

                    return ResponseEntity.ok(updatedBrand);
                } else {
                    return new ResponseEntity<>("Không có thay đổi nào được thực hiện!", HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>("Thương hiệu không tồn tại!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi cập nhật thương hiệu!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a brand
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable("id") Integer id, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Brand> existingBrand = brandsDAO.findById(id);
            if (existingBrand.isPresent()) {
                Brand brand = existingBrand.get();
                
                if (!brand.getStockReceipts().isEmpty()) {
                    return new ResponseEntity<>("Không thể xóa thương hiệu này vì đang có phiếu nhập kho liên quan!",
                            HttpStatus.CONFLICT);
                }

                // Create detailed log message
                String logMessage = String.format("""
                        ADMIN: %s đã xóa thương hiệu
                        Chi tiết:
                        - ID: %d
                        - Tên thương hiệu: %s
                        - Số điện thoại: %s
                        - Email: %s
                        - Địa chỉ: %s""",
                        authentication.getName(),
                        id,
                        brand.getName(),
                        brand.getPhoneNumber(),
                        brand.getEmail() != null ? brand.getEmail() : "Không có",
                        brand.getAddress() != null ? brand.getAddress() : "Không có");

                // Perform deletion
                brandsDAO.deleteById(id);
                
                userHistoryService.logUserAction(
                    authentication.getName(),
                    UserActionType.DELETE_BRAND,
                    logMessage,
                    getClientIp(request),
                    getClientInfo(request)
                );
                
                return ResponseEntity.ok(String.format("ADMIN: %s đã xóa thương hiệu '%s' thành công!",
                        authentication.getName(), brand.getName()));
            } else {
                return new ResponseEntity<>("Thương hiệu không tồn tại!", HttpStatus.NOT_FOUND);
            }
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa thương hiệu này vì đang được sử dụng!", HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi xóa thương hiệu!", HttpStatus.INTERNAL_SERVER_ERROR);
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
