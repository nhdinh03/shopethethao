package com.shopethethao.modules.brands;

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
@RequestMapping("/api/brands")
public class BrandAPI {

    private static final Logger logger = LoggerFactory.getLogger(BrandAPI.class);

    @Autowired
    private BrandDAO brandsDAO;

    @Autowired
    private AdminLogService adminLogService;

    // Fetch all brands without pagination
    @GetMapping("/get/all")
    public ResponseEntity<List<Brand>> findAll() {
        List<Brand> brands = brandsDAO.findAll();
        return ResponseEntity.ok(brands);
    }

    // Fetch brands with pagination
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
            
            Page<Brand> page;
            if (search.isPresent() && !search.get().trim().isEmpty()) {
                page = brandsDAO.searchBrands(search.get().trim(), pageable);
            } else {
                page = brandsDAO.findAll(pageable);
            }

            ResponseDTO<Brand> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            logger.error("Error fetching brands", e);
            return new ResponseEntity<>("Lỗi server, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create a new brand
    @PostMapping
    public ResponseEntity<?> createBrand(@RequestBody Brand brand, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            // Validate required fields
            if (brand.getName() == null || brand.getName().trim().isEmpty()) {
                String errorMessage = "Tên thương hiệu không được để trống!";
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "THÊM THẤT BẠI: " + errorMessage,
                    "BRAND");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            }

            Brand savedBrand = brandsDAO.save(brand);
            
            String logMessage = String.format("""
                    Thêm thương hiệu mới:
                    - Mã: %d
                    - Tên thương hiệu: %s
                    - Số điện thoại: %s
                    - Email: %s
                    - Địa chỉ: %s""",
                    savedBrand.getId(),
                    savedBrand.getName(),
                    savedBrand.getPhoneNumber(),
                    savedBrand.getEmail() != null ? savedBrand.getEmail() : "Không có",
                    savedBrand.getAddress() != null ? savedBrand.getAddress() : "Không có");

            adminLogService.logAdminAction(
                authentication.getName(),
                request,
                logMessage,
                "BRAND");

            Map<String, Object> response = new HashMap<>();
            response.put("brand", savedBrand);
            response.put("message", "Thêm thương hiệu thành công");
            response.put("createdBy", authentication.getName());
            response.put("createdAt", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMessage = "Không thể tạo thương hiệu: " + e.getMessage();
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "BRAND");
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing brand
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(
            @PathVariable Integer id,
            @RequestBody Brand brand, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Brand> optionalBrand = brandsDAO.findById(id);
            if (optionalBrand.isEmpty()) {
                String errorMessage = String.format("Thương hiệu #%d không tồn tại!", id);
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "CẬP NHẬT THẤT BẠI: " + errorMessage,
                    "BRAND");
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            Brand existingBrand = optionalBrand.get();
            List<String> changes = trackChanges(existingBrand, brand);

            if (!changes.isEmpty()) {
                Brand updatedBrand = brandsDAO.save(existingBrand);

                String changeLog = String.format("""
                    Cập nhật thương hiệu #%d:
                    %s""",
                    id,
                    String.join(System.lineSeparator(), changes));

                adminLogService.logAdminAction(
                    authentication.getName(),
                    request,
                    changeLog,
                    "BRAND");

                Map<String, Object> response = new HashMap<>();
                response.put("brand", updatedBrand);
                response.put("changes", changes);
                response.put("updateTime", LocalDateTime.now());
                response.put("updatedBy", authentication.getName());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.ok("Không có thay đổi nào được thực hiện!");
            }
        } catch (Exception e) {
            String errorMessage = String.format("Lỗi khi cập nhật thương hiệu #%d: %s", id, e.getMessage());
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "BRAND");
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a brand
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(
            @PathVariable Integer id, 
            Authentication authentication,
            HttpServletRequest request) {
        try {
            Optional<Brand> existingBrand = brandsDAO.findById(id);
            if (existingBrand.isEmpty()) {
                String errorMessage = String.format("Thương hiệu #%d không tồn tại!", id);
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "XÓA THẤT BẠI: " + errorMessage,
                    "BRAND");
                return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
            }

            Brand brand = existingBrand.get();
            if (!brand.getStockReceipts().isEmpty()) {
                String errorMessage = "Không thể xóa thương hiệu này vì đang có phiếu nhập kho liên quan!";
                adminLogService.logAdminAction(
                    authentication.getName(), 
                    request, 
                    "XÓA THẤT BẠI: " + errorMessage,
                    "BRAND");
                return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
            }

            String logMessage = String.format("""
                Xóa thương hiệu:
                - Mã: %d
                - Tên thương hiệu: %s
                - Số điện thoại: %s
                - Email: %s
                - Địa chỉ: %s""",
                id,
                brand.getName(),
                brand.getPhoneNumber(),
                brand.getEmail() != null ? brand.getEmail() : "Không có",
                brand.getAddress() != null ? brand.getAddress() : "Không có");

            brandsDAO.deleteById(id);
            
            adminLogService.logAdminAction(
                authentication.getName(),
                request,
                logMessage,
                "BRAND");

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Xóa thương hiệu thành công");
            response.put("deletedBy", authentication.getName());
            response.put("deletedAt", LocalDateTime.now());
            response.put("brandInfo", brand);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMessage = String.format("Lỗi khi xóa thương hiệu #%d: %s", id, e.getMessage());
            adminLogService.logAdminAction(
                authentication.getName(), 
                request, 
                "LỖI: " + errorMessage,
                "BRAND");
            return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<String> trackChanges(Brand existingBrand, Brand newBrand) {
        List<String> changes = new ArrayList<>();
        
        if (!existingBrand.getName().equals(newBrand.getName())) {
            changes.add(String.format("- Tên thương hiệu:%n  + Cũ: '%s'%n  + Mới: '%s'",
                existingBrand.getName(), newBrand.getName()));
            existingBrand.setName(newBrand.getName());
        }

        if (!existingBrand.getPhoneNumber().equals(newBrand.getPhoneNumber())) {
            changes.add(String.format("- Số điện thoại:%n  + Cũ: '%s'%n  + Mới: '%s'",
                existingBrand.getPhoneNumber(), newBrand.getPhoneNumber()));
            existingBrand.setPhoneNumber(newBrand.getPhoneNumber());
        }

        if (!Objects.equals(existingBrand.getEmail(), newBrand.getEmail())) {
            changes.add(String.format("- Email:%n  + Cũ: '%s'%n  + Mới: '%s'",
                existingBrand.getEmail() != null ? existingBrand.getEmail() : "Không có",
                newBrand.getEmail() != null ? newBrand.getEmail() : "Không có"));
            existingBrand.setEmail(newBrand.getEmail());
        }

        if (!Objects.equals(existingBrand.getAddress(), newBrand.getAddress())) {
            changes.add(String.format("- Địa chỉ:%n  + Cũ: '%s'%n  + Mới: '%s'",
                existingBrand.getAddress() != null ? existingBrand.getAddress() : "Không có",
                newBrand.getAddress() != null ? newBrand.getAddress() : "Không có"));
            existingBrand.setAddress(newBrand.getAddress());
        }

        return changes;
    }
}
