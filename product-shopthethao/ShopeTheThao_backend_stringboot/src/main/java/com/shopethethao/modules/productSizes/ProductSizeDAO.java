package com.shopethethao.modules.productSizes;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductSizeDAO extends JpaRepository<ProductSize, Integer> {

    void deleteByProductId(Integer productId);
}
