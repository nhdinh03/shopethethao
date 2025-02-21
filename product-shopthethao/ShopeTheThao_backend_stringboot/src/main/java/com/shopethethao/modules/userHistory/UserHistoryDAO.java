package com.shopethethao.modules.userHistory;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserHistoryDAO extends JpaRepository<UserHistory, Long>, JpaSpecificationExecutor<UserHistory> {
    
    @Query("SELECT h FROM UserHistory h WHERE " +
           "(:actionType is null OR h.actionType = :actionType) AND " +
           "(:startDate is null OR h.historyDateTime >= :startDate) AND " +
           "(:endDate is null OR h.historyDateTime <= :endDate) AND " +
           "(:userId is null OR h.account.id = :userId)")
    Page<UserHistory> findWithFilters(
        @Param("actionType") UserActionType actionType,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("userId") String userId,
        Pageable pageable
    );

    @Query("SELECT h FROM UserHistory h " +
           "WHERE h.historyDateTime BETWEEN :startDate AND :endDate " +
           "ORDER BY h.historyDateTime DESC")
    List<UserHistory> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
