package com.shopethethao.auth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shopethethao.auth.models.SecurityAccount;



@Repository
public interface AccountRepository extends JpaRepository<SecurityAccount, String> {

    List<SecurityAccount> findAllByOrderByCreatedDateDesc();

    Optional<SecurityAccount> findById(String id);

    boolean existsById(String id);

    Boolean existsByEmail(String email);

    Optional<SecurityAccount> findByEmail(String email);

    Boolean existsByFullname(String fullname);

    Boolean existsByPhone(String phone);

    SecurityAccount findByIdAndPassword(String id, String password);

}
