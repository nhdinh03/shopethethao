package com.shopethethao.modules.role;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shopethethao.auth.models.SecurityERole;

public interface RoleDAO extends JpaRepository<Role, Long> {
    Optional<Role> findByName(SecurityERole name);

    boolean existsByName(SecurityERole name);

    List<Role> findAllByOrderByIdDesc();
}