package com.shopethethao.modules.comments;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.products.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "like_count")
    private Integer likeCount;

    @Column(name = "order_date", nullable = false)
    private java.util.Date orderDate; 

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Account account;
    

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    // @JsonIgnore
    private Product product;

}
