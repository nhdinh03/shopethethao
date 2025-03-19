package com.shopethethao.modules.feedback;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackResponse {
    private Integer id;
    private String email;
    private String message;
    private String createdAt;
    private Integer status;
    private String statusText;

    public void setStatus(Integer status) {
        this.status = status;
        this.statusText = switch (status) {
            case 0 -> "Chưa xử lý";
            case 1 -> "Đang xử lý";
            case 2 -> "Đã xử lý";
            default -> "Không xác định";
        };
    }
}
