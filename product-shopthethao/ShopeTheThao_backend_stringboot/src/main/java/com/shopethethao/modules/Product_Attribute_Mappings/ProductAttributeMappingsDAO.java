package com.shopethethao.modules.product_Attribute_Mappings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductAttributeMappingsDAO extends JpaRepository<ProductAttributeMappings, Integer> {

    void deleteByProductIdAndAttributeId(Integer productId, Integer attributeId);
}