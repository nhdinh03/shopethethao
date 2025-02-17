package com.shopethethao.modules.cancelReason;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface CancelReasonDAO extends JpaRepository<CancelReason, Integer> {
    @Query("SELECT c FROM CancelReason c")
    List<CancelReason> findAllReasons();
}
