package com.shopethethao.modules.comments;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/comment")
public class CommentAPI {

    @Autowired
    private CommentDAO commentDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<Comment>> findAll() {
        List<Comment> comments = commentDAO.findAll();
        return ResponseEntity.ok(comments);
    }

}
