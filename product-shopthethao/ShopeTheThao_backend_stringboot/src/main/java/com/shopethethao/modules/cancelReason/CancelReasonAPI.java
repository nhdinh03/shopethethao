package com.shopethethao.modules.cancelReason;

import com.shopethethao.dto.CancelReasonDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cancelreason")
public class CancelReasonAPI {

    @Autowired
    private CancelReasonDAO cancelReasonDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<CancelReasonDTO>> findAll() {
        List<CancelReason> cancelReasons = cancelReasonDAO.findAll();

        // Debug dữ liệu từ database
        System.out.println("Cancel Reasons from DB: " + cancelReasons);

        List<CancelReasonDTO> result = cancelReasons.stream()
                .map(cancelReason -> new CancelReasonDTO(cancelReason.getId(), cancelReason.getReason()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
