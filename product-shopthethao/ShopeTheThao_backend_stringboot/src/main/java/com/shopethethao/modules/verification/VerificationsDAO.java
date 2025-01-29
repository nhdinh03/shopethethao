package com.shopethethao.modules.verification;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationsDAO extends JpaRepository<Verifications, Long> {

    List<Verifications> findByAccountId(String id);

    Optional<Verifications> findByCode(String code);

}
