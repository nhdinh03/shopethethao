package com.shopethethao.modules.account;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shopethethao.modules.role.Role;

import jakarta.transaction.Transactional;

@Repository
public interface AccountDAO extends JpaRepository<Account, String> {

    // user
    @Query(value = """
                SELECT a.* FROM Accounts a
                INNER JOIN Accounts_Roles ar ON a.id = ar.account_id
                INNER JOIN Roles r ON ar.role_id = r.id
                WHERE r.name = 'USER'
                ORDER BY a.id
                OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
            """, nativeQuery = true)
    List<Account> findAllUsersWithPagination(@Param("offset") int offset, @Param("limit") int limit);

    @Query(value = """
                SELECT COUNT(*) FROM Accounts a
                INNER JOIN Accounts_Roles ar ON a.id = ar.account_id
                INNER JOIN Roles r ON ar.role_id = r.id
                WHERE r.name = 'USER'
            """, nativeQuery = true)
    long countAllUsers();

    // xóa user
    @Modifying
    @Transactional
    @Query("DELETE FROM Account a WHERE a.id = :id")
    void deleteById(@Param("id") String id);

    @Query("SELECT a FROM Account a JOIN a.roles r WHERE r = :role")
    Page<Account> findByRoles(@Param("role") Role role, Pageable pageable);

    Page<Account> findByRolesAndStatus(Role role, int status, Pageable pageable);
    long countByRolesAndStatus(Role role, int status);

    // jwt

    List<Account> findByStatus(int status);

    List<Account> findAllByOrderByCreatedDateDesc();

    Optional<Account> findById(String id);

    Optional<Account> findByPhone(String Phone);

    Optional<Account> findByEmail(String email);

    // Add this new method to fetch account with roles eagerly
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.roles WHERE a.email = :email")
    Optional<Account> findByEmailWithRoles(@Param("email") String email);

    boolean existsById(String id);

    Boolean existsByEmail(String email);

    Boolean existsByFullname(String fullname);

    Boolean existsByPhone(String phone);

    Account findByIdAndPassword(String id, String password);

    Page<Account> findByStatus(int status, Pageable pageable);
    
    @Query("SELECT a FROM Account a WHERE a.status = 0 AND (a.fullname LIKE %?1% OR a.email LIKE %?1% OR a.phone LIKE %?1%)")
    Page<Account> searchLockedAccounts(String keyword, Pageable pageable);

    @Query("""
        SELECT a FROM Account a 
        WHERE a.status = 1 
        AND a.verified = true 
        AND a.email IS NOT NULL 
        ORDER BY a.id 
        LIMIT :batchSize OFFSET :offset
        """)
    List<Account> findActiveUsersWithVerifiedEmail(
        @Param("offset") int offset, 
        @Param("batchSize") int batchSize
    );
}
