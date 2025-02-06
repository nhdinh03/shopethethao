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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.shopethethao.dto.ResponseDTO;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierAPI {

    @Autowired
    private SupplierDAO supplierDao;

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
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier) {
        try {
            Supplier savedSupplier = supplierDao.save(supplier);
            return ResponseEntity.ok(savedSupplier);
        } catch (Exception e) {
        
            return new ResponseEntity<>("Failed to create supplier!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing supplier
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable("id") Integer id,
            @RequestBody Supplier supplier) {
        try {
            Optional<Supplier> existingSupplier = supplierDao.findById(id);
            if (existingSupplier.isPresent()) {
                supplier.setId(id); // Ensure that the correct ID is set
                Supplier updatedSupplier = supplierDao.save(supplier);
                return ResponseEntity.ok(updatedSupplier);
            } else {
                return new ResponseEntity<>("Supplier not found!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
    
            return new ResponseEntity<>("Failed to update supplier!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable("id") Integer id) {
        try {
            Optional<Supplier> existingSupplier = supplierDao.findById(id);
            if (existingSupplier.isPresent()) {
                supplierDao.deleteById(id);
                return ResponseEntity.ok("Supplier deleted successfully!");
            } else {
                return new ResponseEntity<>("Supplier not found!", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
   
            return new ResponseEntity<>("Failed to delete supplier!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
