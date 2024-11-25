package com.shopethethao.modules.distinctives;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistinctiveDAO extends JpaRepository <Distinctive, String> {
    
}
