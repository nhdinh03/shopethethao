package com.shopethethao.modules.lock_reasons;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface LockReasonsDAO extends JpaRepository<LockReasons, Integer> {
    
    @Query("SELECT lr FROM LockReasons lr WHERE lr.account.fullname LIKE %?1%")
    Page<LockReasons> searchByAccountName(String fullname, Pageable pageable);
    
    @Query("SELECT lr FROM LockReasons lr JOIN lr.account a WHERE a.status = 0")
    Page<LockReasons> findAllLockedAccounts(Pageable pageable);
    
    @Query("SELECT lr FROM LockReasons lr JOIN lr.account a WHERE a.status = 0 AND a.fullname LIKE %?1%")
    Page<LockReasons> searchLockedAccountsByName(String fullname, Pageable pageable);

    @Modifying
    @Transactional
    @Query("DELETE FROM LockReasons l WHERE l.account.id = ?1")
    void deleteByAccountId(String accountId);
}