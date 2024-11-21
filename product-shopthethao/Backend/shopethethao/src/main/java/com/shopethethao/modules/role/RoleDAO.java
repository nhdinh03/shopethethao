package com.shopethethao.modules.role;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleDAO extends JpaRepository<Role, Long> {
    boolean existsByName(String name);
    List<Role> findAllByOrderByIdDesc();
}