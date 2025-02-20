package com.shopethethao.modules.userHistory;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserHistoryDAO extends JpaRepository<UserHistory, Integer> {
    
    @Query("SELECT uh FROM UserHistory uh JOIN FETCH uh.user WHERE uh.historyDateTime BETWEEN :startDate AND :endDate")
    List<UserHistory> findByDateRange(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT uh FROM UserHistory uh JOIN FETCH uh.user u WHERE u.id = :userId")
    List<UserHistory> findByUserId(@Param("userId") String userId);

    @Query("SELECT uh FROM UserHistory uh JOIN FETCH uh.user WHERE uh.actionType = :actionType")
    List<UserHistory> findByActionType(@Param("actionType") UserActionType actionType);

    @Query("SELECT uh FROM UserHistory uh JOIN FETCH uh.user u LEFT JOIN FETCH u.roles " +
           "WHERE (:actionType IS NULL OR uh.actionType = :actionType) " +
           "AND (:startDate IS NULL OR uh.historyDateTime >= :startDate) " +
           "AND (:endDate IS NULL OR uh.historyDateTime <= :endDate) " +
           "AND (:userId IS NULL OR u.id = :userId) " +
           "ORDER BY uh.historyDateTime DESC")
    Page<UserHistory> findWithFilters(
        @Param("actionType") UserActionType actionType,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("userId") String userId,
        Pageable pageable
    );
}
