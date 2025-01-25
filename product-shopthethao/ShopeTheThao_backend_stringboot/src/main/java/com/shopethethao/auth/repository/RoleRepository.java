package com.shopethethao.auth.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopethethao.auth.models.SecurityERole;
import com.shopethethao.auth.models.SecurityRole;



public interface RoleRepository extends JpaRepository<SecurityRole, Long> {
    Optional<SecurityRole> findByName(SecurityERole name);

}