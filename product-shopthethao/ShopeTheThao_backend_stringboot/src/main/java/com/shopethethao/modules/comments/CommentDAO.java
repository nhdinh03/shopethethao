package com.shopethethao.modules.comments;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentDAO extends JpaRepository <Comment, Integer> {
    
}
