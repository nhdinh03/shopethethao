package com.shopethethao.modules.comments;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
@Entity
@Table(name = "Comments")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "content")
    private String content;

    @Column(name = "like_count")
    private Integer likeCount;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;
    
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false,
                foreignKey = @ForeignKey(name = "FK_Comments_User"))
    private Account account;
    
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false,
                foreignKey = @ForeignKey(name = "FK_Comments_Product"))
    private Product product;
}
