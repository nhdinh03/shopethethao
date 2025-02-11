package com.shopethethao.modules.Product_Images;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImagesDAO extends JpaRepository<ProductImages, Long> {

        List<ProductImages> findAllByOrderByIdDesc();

        void deleteByProductId(Integer productId);

        boolean existsByImageUrl(String imageUrl);
}