package com.shopethethao.modules.feedback;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;


@Entity

@Data
@Table(name = "Feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 350)
    private String email;
    
    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String message;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private Integer status;

    public Feedback() {
        this.createdAt = LocalDateTime.now();
        this.status = 0; // Default status: Chưa xử lý
    }
}