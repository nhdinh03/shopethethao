package com.shopethethao.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserHistoryDTO {
    private Integer idHistory;
    private String note;
    private LocalDateTime historyDateTime;
    private String userId;
    private String username;
}