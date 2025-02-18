package com.shopethethao.modules.product_Attributes;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductAttributesDAO extends JpaRepository<ProductAttributes, Integer> {
}
