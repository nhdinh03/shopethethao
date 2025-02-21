package com.shopethethao.modules.role;

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
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.dto.RoleValidationException;
import com.shopethethao.modules.userHistory.UserHistoryService;

import jakarta.servlet.http.HttpServletRequest;

import com.shopethethao.modules.userHistory.UserActionType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/role")
public class RoleAPI {

    @Autowired
    RoleDAO roleDAO;

    @Autowired
    UserHistoryService userHistoryService;

    @ExceptionHandler(RoleValidationException.class)
    public ResponseEntity<String> handleRoleValidationException(RoleValidationException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<Role>> findAll() {
        List<Role> roles = roleDAO.findAllByOrderByIdDesc();
        return ResponseEntity.ok(roles);
    }

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Không tìm thấy trang", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Role> page = roleDAO.findAll(pageable);

            ResponseDTO<Role> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi máy chủ, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void validateRole(Role role) {
        if (role == null || role.getName() == null || role.getDescription() == null) {
            throw new RoleValidationException("Vai trò và thông tin không được để trống");
        }

        if (!ERole.getAllowedValues().contains(role.getName().name())) {
            throw new RoleValidationException("Vai trò không hợp lệ");
        }

        if (role.getDescription().trim().isEmpty() || role.getDescription().length() > 255) {
            throw new RoleValidationException("Mô tả vai trò không hợp lệ (0-255 ký tự)");
        }
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Role role, HttpServletRequest request) {
        try {
            validateRole(role);
            
            if (roleDAO.existsByName(role.getName())) {
                throw new RoleValidationException("Vai trò đã tồn tại!");
            }
            
            Role savedRole = roleDAO.save(role);

            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                        userId,
                        UserActionType.CREATE_ROLE,
                        "Tạo mới vai trò: " + role.getName(),
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent"));
            }

            return ResponseEntity.ok(savedRole);
        } catch (RoleValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống, vui lòng thử lại sau!");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Role role, HttpServletRequest request) {
        try {
            validateRole(role);
            
            Role existingRole = roleDAO.findById(id)
                    .orElseThrow(() -> new RoleValidationException("Vai trò không tồn tại!"));

            Optional<Role> duplicateRoleOpt = roleDAO.findByName(role.getName());
            if (duplicateRoleOpt.isPresent() && !duplicateRoleOpt.get().getId().equals(id)) {
                throw new RoleValidationException("Vai trò này đã tồn tại!");
            }

            String oldName = existingRole.getName().toString();
            existingRole.setName(role.getName());
            existingRole.setDescription(role.getDescription());
            Role updatedRole = roleDAO.save(existingRole);

            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                        userId,
                        UserActionType.UPDATE_ROLE,
                        "Cập nhật vai trò từ '" + oldName + "' thành '" + role.getName() + "'",
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent"));
            }

            return ResponseEntity.ok(updatedRole);
        } catch (RoleValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống, vui lòng thử lại sau!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSize(@PathVariable("id") Long id, HttpServletRequest request) {
        try {
            Optional<Role> existingRole = roleDAO.findById(id);
            if (existingRole.isPresent()) {
                String roleName = existingRole.get().getName().toString();
                roleDAO.deleteById(id);

                String userId = getCurrentUserId();
                if (userId != null) {
                    userHistoryService.logUserAction(
                            userId,
                            UserActionType.DELETE_ROLE,
                            "Xóa vai trò: " + roleName,
                            request.getRemoteAddr(),
                            request.getHeader("User-Agent"));
                }

                return ResponseEntity.ok("Vai trò đã được xóa thành công!");
            } else {
                return new ResponseEntity<>("Không tìm thấy vai trò!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể xóa vai trò!", HttpStatus.INTERNAL_SERVER_ERROR);
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
