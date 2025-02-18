package com.shopethethao.modules.userHistory;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.UserHistoryDTO;

@RestController
@RequestMapping("/api/userhistory")
public class UserHistoryAPI {
    private static final Logger logger = LoggerFactory.getLogger(UserHistoryAPI.class);
    @Autowired
    UserHistoryDAO userHistoriesDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<UserHistoryDTO>> findAll() {
        try {
            List<UserHistory> histories = userHistoriesDAO.findAll();
            List<UserHistoryDTO> dtos = histories.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Error fetching user histories: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private UserHistoryDTO convertToDTO(UserHistory history) {
        UserHistoryDTO dto = new UserHistoryDTO();
        dto.setIdHistory(history.getIdHistory());
        dto.setNote(history.getNote());
        dto.setHistoryDateTime(history.getHistoryDateTime());
        dto.setUserId(history.getUser().getId());
        dto.setUsername(history.getUser().getFullname());
        return dto;
    }
}