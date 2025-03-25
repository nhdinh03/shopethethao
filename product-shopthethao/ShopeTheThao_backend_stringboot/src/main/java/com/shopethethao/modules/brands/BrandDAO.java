package com.shopethethao.modules.brands;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BrandDAO extends JpaRepository<Brand, Integer> {
    @Query("SELECT b FROM Brand b WHERE " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(b.phoneNumber) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(b.email) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(b.address) LIKE LOWER(CONCAT('%', ?1, '%'))")
    Page<Brand> searchBrands(String keyword, Pageable pageable);
}
