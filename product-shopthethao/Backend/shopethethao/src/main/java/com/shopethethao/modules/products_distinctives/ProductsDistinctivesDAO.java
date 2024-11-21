package com.shopethethao.modules.products_distinctives;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductsDistinctivesDAO extends JpaRepository<ProductsDistinctives, String> {


    
}
