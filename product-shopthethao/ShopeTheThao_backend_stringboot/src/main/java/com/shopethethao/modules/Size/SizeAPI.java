package com.shopethethao.modules.size;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.userHistory.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/size")
public class SizeAPI {

    @Autowired
    private SizeDAO sizeDAO;

    @Autowired
    private UserHistoryService userHistoryService;

    // Fetch all sizes
    @GetMapping("/get/all")
    public ResponseEntity<List<Size>> findAll() {
        List<Size> sizes = sizeDAO.findAll();
        return ResponseEntity.ok(sizes);
    }

    // Fetch sizes with pagination
    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
                                     @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Page not found", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Size> page = sizeDAO.findAll(pageable);

            ResponseDTO<Size> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, please try again later!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a new size
    @PostMapping
    public ResponseEntity<Size> addSize(@RequestBody Size size, HttpServletRequest request) {
        try {
            Size savedSize = sizeDAO.save(size);
            
            // Log the create action
            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.CREATE_SIZE,
                    "Tạo size mới: " + savedSize.getName(),
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent")
                );
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSize);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Edit an existing size
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSize(
            @PathVariable("id") Integer id, 
            @RequestBody Size size,
            HttpServletRequest request) {
        try {
            Optional<Size> existingSize = sizeDAO.findById(id);
            if (existingSize.isPresent()) {
                size.setId(id);
                Size updatedSize = sizeDAO.save(size);

                // Log the update action
                String userId = getCurrentUserId();
                if (userId != null) {
                    userHistoryService.logUserAction(
                        userId,
                        UserActionType.UPDATE_SIZE,
                        "Cập nhật size: " + updatedSize.getName(),
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent")
                    );
                }

                return ResponseEntity.ok(updatedSize);
            } else {
                return new ResponseEntity<>("Size not found!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update size!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a size
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSize(
            @PathVariable("id") Integer id,
            HttpServletRequest request) {
        try {
            Optional<Size> existingSize = sizeDAO.findById(id);
            if (existingSize.isPresent()) {
                String sizeName = existingSize.get().getName();
                sizeDAO.deleteById(id);

                // Log the delete action
                String userId = getCurrentUserId();
                if (userId != null) {
                    userHistoryService.logUserAction(
                        userId,
                        UserActionType.DELETE_SIZE,
                        "Xóa size: " + sizeName,
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent")
                    );
                }

                return ResponseEntity.ok("Size deleted successfully!");
            } else {
                return new ResponseEntity<>("Size not found!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete size!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper method to get current user ID
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }
}
