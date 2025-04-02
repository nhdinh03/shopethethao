package com.shopethethao.error;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        HttpStatus status = getStatus(request);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("path", request.getAttribute("jakarta.servlet.error.request_uri"));
        errorResponse.put("timestamp", System.currentTimeMillis());

        switch (status) {
            case NOT_FOUND:
                errorResponse.put("message", "Không tìm thấy tài nguyên yêu cầu");
                break;
            case INTERNAL_SERVER_ERROR:
                errorResponse.put("message", "Đã xảy ra lỗi trong quá trình xử lý");
                break;
            case FORBIDDEN:
                errorResponse.put("message", "Bạn không có quyền truy cập tài nguyên này");
                break;
            default:
                errorResponse.put("message", "Đã xảy ra lỗi");
        }

        return ResponseEntity.status(status).body(errorResponse);
    }

    private HttpStatus getStatus(HttpServletRequest request) {
        Integer statusCode = (Integer) request.getAttribute("jakarta.servlet.error.status_code");
        if (statusCode == null) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
        try {
            return HttpStatus.valueOf(statusCode);
        } catch (Exception ex) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
