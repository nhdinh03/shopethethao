package com.shopethethao.modules.categories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategorieDAO extends JpaRepository<Categorie, Integer> {
    
    Optional<Categorie> findByName(String name);
    
    @Query("SELECT c FROM Categorie c WHERE LOWER(c.name) = LOWER(?1)")
    Optional<Categorie> findByNameIgnoreCase(String name);

    boolean existsById(Integer id);
}
