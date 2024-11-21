package com.shopethethao.modules.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ProductsDAO extends JpaRepository<Product, String> {

}
