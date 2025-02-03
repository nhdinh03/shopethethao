package com.shopethethao.modules.products;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductsDAO extends JpaRepository<Product, Integer> {

    boolean existsByCategorieId(Integer categorieId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.sizes WHERE p.id = :id")
    Optional<Product> findByIdWithSizes(@Param("id") Integer id);

}
