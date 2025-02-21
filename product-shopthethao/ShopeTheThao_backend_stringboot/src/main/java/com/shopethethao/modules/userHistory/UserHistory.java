package com.shopethethao.modules.userHistory;

import com.shopethethao.modules.account.Account;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "UserHistory")
public class UserHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_history")
    private Long idHistory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name = "actionType", columnDefinition = "NVARCHAR(50)")
    private UserActionType actionType;

    @Column(name = "note", columnDefinition = "NVARCHAR(200)")
    private String note;

    @Column(name = "ipAddress", columnDefinition = "NVARCHAR(45)")
    private String ipAddress;

    @Column(name = "deviceInfo", columnDefinition = "NVARCHAR(200)")
    private String deviceInfo;
    
    @Column(name = "history_datetime", nullable = false, 
            columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime historyDateTime;
    
    @Column(name = "status", columnDefinition = "INT DEFAULT 1")
    private Integer status = 1;

    @PrePersist
    protected void onCreate() {
        if (historyDateTime == null) {
            historyDateTime = LocalDateTime.now();
        }
        if (status == null) {
            status = 1;
        }
    }

    public String getUserId() {
        return account != null ? account.getId() : null;
    }
}