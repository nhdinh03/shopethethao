package com.shopethethao.modules.userHistory;

import java.time.LocalDateTime;

import com.shopethethao.modules.account.Account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "UserHistory")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_history")
    private Integer idHistory;

    @Column(name = "action_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserActionType actionType;

    @Column(name = "note", length = 200)
    private String note;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "device_info", length = 200)
    private String deviceInfo;

    @Column(name = "history_datetime", nullable = false)
    private LocalDateTime historyDateTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, 
                foreignKey = @ForeignKey(name = "FK_UserHistory_Accounts"))
    private Account user;

    @Column(name = "status")
    private Boolean status = true;

    @PrePersist
    protected void onCreate() {
        if (historyDateTime == null) {
            historyDateTime = LocalDateTime.now();
        }
    }
}