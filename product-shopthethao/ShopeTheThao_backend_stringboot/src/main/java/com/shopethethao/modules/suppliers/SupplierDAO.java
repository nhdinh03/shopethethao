package com.shopethethao.modules.suppliers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierDAO extends JpaRepository<Supplier, Integer> {
    @Query("SELECT s FROM Supplier s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(s.address) LIKE LOWER(CONCAT('%', ?1, '%'))")
    Page<Supplier> searchSuppliers(String keyword, Pageable pageable);
}
