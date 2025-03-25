package com.shopethethao.modules.product_Attributes;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductAttributesDAO extends JpaRepository<ProductAttributes, Integer> {
    Optional<ProductAttributes> findByNameIgnoreCase(String name);

    @Query("SELECT p FROM ProductAttributes p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%'))")
    Page<ProductAttributes> searchByName(String name, Pageable pageable);
}
