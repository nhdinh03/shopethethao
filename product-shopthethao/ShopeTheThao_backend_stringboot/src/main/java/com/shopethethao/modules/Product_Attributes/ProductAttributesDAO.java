package com.shopethethao.modules.product_Attributes;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductAttributesDAO extends JpaRepository<ProductAttributes, Integer> {
    Optional<ProductAttributes> findByNameIgnoreCase(String name);
}
