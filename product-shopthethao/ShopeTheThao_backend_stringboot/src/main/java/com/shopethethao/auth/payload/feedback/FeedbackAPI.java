package com.shopethethao.auth.payload.feedback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.auth.otp.util.EmailUtil;

import jakarta.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/feedback")
public class FeedbackAPI {
    
    @Autowired
    private EmailUtil emailUtil;
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackModal feedbackModal) {
        try {
            // Validate input
            if (feedbackModal.getEmail() == null || feedbackModal.getEmail().trim().isEmpty()) {
                return new ResponseEntity<>("Email không được để trống", HttpStatus.BAD_REQUEST);
            }
            
            if (feedbackModal.getMessage() == null || feedbackModal.getMessage().trim().isEmpty()) {
                return new ResponseEntity<>("Nội dung góp ý không được để trống", HttpStatus.BAD_REQUEST);
            }
            
            // Send feedback email
            emailUtil.sendFeedbackEmail(feedbackModal.getEmail(), feedbackModal.getMessage());
            
            // Return success response
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Cảm ơn bạn đã góp ý! Chúng tôi đã nhận được phản hồi của bạn.");
            
            return ResponseEntity.ok(response);
            
        } catch (MessagingException e) {
            // Handle email sending error
            return new ResponseEntity<>("Có lỗi xảy ra khi gửi góp ý: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Handle other errors
            return new ResponseEntity<>("Đã xảy ra lỗi: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
