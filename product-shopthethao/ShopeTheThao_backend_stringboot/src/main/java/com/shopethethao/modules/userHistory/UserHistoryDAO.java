package com.shopethethao.modules.userHistory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserHistoryDAO extends JpaRepository<UserHistory, Integer> {
   
    @Query("SELECT uh FROM UserHistory uh JOIN FETCH uh.user")
    List<UserHistory> findAll();
}
