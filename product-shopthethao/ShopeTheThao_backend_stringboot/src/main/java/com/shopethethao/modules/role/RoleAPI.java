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

@RestController
@RequestMapping("/api/role")
public class RoleAPI {

    @Autowired
    RoleDAO roleDAO;

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
        if (role == null) {
            throw new RoleValidationException("Role không được để trống");
        }

        if (role.getName() == null) {
            throw new RoleValidationException("Tên role không được để trống");
        }

        // Validate against allowed values
        if (!ERole.getAllowedValues().contains(role.getName().name())) {
            throw new RoleValidationException("Vai trò phải là một trong: " + 
                String.join(", ", ERole.getAllowedValues()));
        }

        // Check if role already exists
        if (roleDAO.existsByName(role.getName())) {
            throw new RoleValidationException("Vai trò " + role.getName() + " đã tồn tại trong hệ thống!");
        }

        String description = role.getDescription();
        if (description == null || description.trim().isEmpty()) {
            throw new RoleValidationException("Mô tả vai trò không được để trống");
        }

        if (description.length() > 255) {
            throw new RoleValidationException("Mô tả vai trò không được vượt quá 255 ký tự");
        }
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Role role) {
        try {
            validateRole(role);
            if (roleDAO.existsByName(role.getName())) {
                throw new RoleValidationException("Vai trò đã tồn tại!");
            }
            Role savedRole = roleDAO.save(role);
            return ResponseEntity.ok(savedRole);
        } catch (RoleValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi hệ thống, vui lòng thử lại sau!");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Role role) {
        try {
            validateRole(role);
            Role existingRole = roleDAO.findById(id)
                .orElseThrow(() -> new RoleValidationException("Vai trò không tồn tại!"));

            Optional<Role> duplicateRoleOpt = roleDAO.findByName(role.getName());
            if (duplicateRoleOpt.isPresent()) {
                Role duplicateRole = duplicateRoleOpt.get();
                if (!duplicateRole.getId().equals(id)) {
                    throw new RoleValidationException("Vai trò đã tồn tại!");
                }
            }

            existingRole.setName(role.getName());
            existingRole.setDescription(role.getDescription());
            Role updatedRole = roleDAO.save(existingRole);
            return ResponseEntity.ok(updatedRole);
        } catch (RoleValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi hệ thống, vui lòng thử lại sau!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSize(@PathVariable("id") Long id) {
        try {
            Optional<Role> existingSize = roleDAO.findById(id);
            if (existingSize.isPresent()) {
                roleDAO.deleteById(id);
                return ResponseEntity.ok("kích thước đã được xóa thành công!");
            } else {
                return new ResponseEntity<>("Không tìm thấy kích thước!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể xóa kích thước!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
