package com.shopethethao.modules.size;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface  SizeDAO extends JpaRepository<Size, Integer> {
    Optional<Size> findByName(String name);
}
