package com.shopethethao.modules.productSizes;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductSizeDAO extends JpaRepository<ProductSize, Integer> {

    void deleteByProductId(Integer productId);

    Optional<ProductSize> findByProductIdAndSizeId(Integer productId, Integer sizeId);

}
