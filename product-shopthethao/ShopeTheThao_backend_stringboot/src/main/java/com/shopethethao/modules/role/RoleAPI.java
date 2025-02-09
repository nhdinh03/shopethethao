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

import com.shopethethao.dto.ResponseDTO;

@RestController
@RequestMapping("/api/role")
public class RoleAPI {

    @Autowired
    RoleDAO roleDAO;

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
                return new ResponseEntity<>("Page not found", HttpStatus.NOT_FOUND);
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
            return new ResponseEntity<>("Server error, please try again later!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Role role) {
        try {
            if (roleDAO.existsByName(role.getName())) {
                return new ResponseEntity<>("Vai trò đã tồn tại!", HttpStatus.CONFLICT);
            }
            roleDAO.save(role);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Role role) {
        try {
            // Kiểm tra xem role có tồn tại không
            if (!roleDAO.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vai trò không tồn tại!");
            }
            Role existingRole = roleDAO.findById(id).orElseThrow(() -> new RuntimeException("Role không tìm thấy!"));
            existingRole.setName(role.getName());
            existingRole.setDescription(role.getDescription());
            roleDAO.save(existingRole);
            return ResponseEntity.ok(existingRole);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSize(@PathVariable("id") Long id) {
        try {
            Optional<Role> existingSize = roleDAO.findById(id);
            if (existingSize.isPresent()) {
                roleDAO.deleteById(id);
                return ResponseEntity.ok("Size deleted successfully!");
            } else {
                return new ResponseEntity<>("Size not found!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete size!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
