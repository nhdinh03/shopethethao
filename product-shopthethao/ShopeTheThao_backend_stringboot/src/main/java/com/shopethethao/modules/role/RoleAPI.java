package com.shopethethao.modules.role;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            if (!roleDAO.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không Tồn tại để xóa!");
            }
            return ResponseEntity.ok().body("Xoá  thành công");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa", HttpStatus.CONFLICT);
        }

    }
}
