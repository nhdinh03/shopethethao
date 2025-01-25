package com.shopethethao.modules.verification;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationsDAO extends JpaRepository<Verifications, String> {

    List<Verifications> findByAccountId(String id);

    Optional<Verifications> findByCode(String code);



}
