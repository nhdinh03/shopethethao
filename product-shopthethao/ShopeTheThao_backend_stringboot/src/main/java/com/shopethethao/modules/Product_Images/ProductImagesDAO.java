package com.shopethethao.modules.product_Images;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImagesDAO extends JpaRepository<ProductImages, Long> {

    List<ProductImages> findAllByOrderByIdDesc();

    @Modifying
    @Query("DELETE FROM ProductImages p WHERE p.product.id = :productId")
    void deleteByProductId(@Param("productId") Integer productId);

    @Modifying
    @Query("DELETE FROM ProductImages p WHERE p.product.id = :productId AND p.imageUrl IN :imageUrls")
    void deleteByProductIdAndImageUrlIn(@Param("productId") Integer productId, @Param("imageUrls") List<String> imageUrls);

    boolean existsByImageUrl(String imageUrl);

    // Add method to check if image exists
    boolean existsByProductIdAndImageUrl(Integer productId, String imageUrl);
}