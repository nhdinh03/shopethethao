package com.shopethethao.modules.size;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SizeDAO extends JpaRepository<Size, Integer> {
    Optional<Size> findByName(String name);
    Page<Size> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String name, String description, Pageable pageable);
}
