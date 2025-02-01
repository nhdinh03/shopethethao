package com.shopethethao.modules.categories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieDAO extends JpaRepository<Categorie, Integer> {

    Optional<Categorie> findByName(String name);

    boolean existsById(Integer id);
}
