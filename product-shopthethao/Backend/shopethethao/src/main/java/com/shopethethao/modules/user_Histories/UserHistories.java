package com.shopethethao.modules.user_Histories;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import com.shopethethao.modules.account.Account;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "User_Histories")
public class UserHistories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_history", nullable = false)
    private Integer idHistory;

    @Column(name = "note", length = 200)
    private String note;

    @Column(name = "history_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date historyDate;

    @Column(name = "history_time", nullable = false, length = 20)
    private String historyTime;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_UserHistories_Accounts"))
    private Account user;

}