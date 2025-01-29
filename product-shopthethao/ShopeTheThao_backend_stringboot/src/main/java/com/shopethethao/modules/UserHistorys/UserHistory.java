package com.shopethethao.modules.UserHistorys;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import com.shopethethao.modules.account.Account;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "User_Histories")
public class UserHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_history", nullable = false)
    private Integer idHistory;

    @Column(name = "note", length = 200)
    private String note;

    @Column(name = "history_date", nullable = false)
    private LocalDate historyDate;

    @Column(name = "history_time", nullable = false, length = 20)
    private String historyTime;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Account user;
}
