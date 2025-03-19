package com.shopethethao.modules.feedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FeedbackDAO extends JpaRepository<Feedback, Integer> {
    Optional<Feedback> findById(Integer id);
}
