package com.shopethethao.modules.feedback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.shopethethao.auth.otp.util.EmailUtil;
import com.shopethethao.modules.feedback.model.FeedbackResponseRequest;

import jakarta.mail.MessagingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/feedback")
public class FeedbackAPI {
    
    @Autowired
    private EmailUtil emailUtil;
    
    @Autowired
    private FeedbackDAO feedbackDAO;
    
    @GetMapping("/get/all")
    public ResponseEntity<List<FeedbackResponse>> findAll() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        List<FeedbackResponse> responses = feedbackDAO.findAll().stream()
            .map(f -> {
                FeedbackResponse resp = new FeedbackResponse();
                resp.setId(f.getId());
                resp.setEmail(f.getEmail());
                resp.setMessage(f.getMessage());
                resp.setCreatedAt(f.getCreatedAt().format(formatter));
                resp.setStatus(f.getStatus());
                return resp;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedbackModal) {
        try {
            // Validate input
            if (feedbackModal.getEmail() == null || feedbackModal.getEmail().trim().isEmpty()) {
                return new ResponseEntity<>("Email không được để trống", HttpStatus.BAD_REQUEST);
            }
            
            if (!feedbackModal.getEmail().endsWith("@gmail.com")) {
                return new ResponseEntity<>("Email phải có đuôi @gmail.com", HttpStatus.BAD_REQUEST);
            }
            
            if (feedbackModal.getMessage() == null || feedbackModal.getMessage().trim().isEmpty()) {
                return new ResponseEntity<>("Nội dung góp ý không được để trống", HttpStatus.BAD_REQUEST);
            }
            
            // Ensure required fields are set
            feedbackModal.setCreatedAt(LocalDateTime.now());
            feedbackModal.setStatus(0);
            
            // Save feedback to database
            feedbackDAO.save(feedbackModal);
            
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

    @PutMapping("/update-status/{id}/{status}")
    public ResponseEntity<?> updateFeedbackStatus(@PathVariable Integer id, @PathVariable Integer status) {
        try {
            Feedback feedback = feedbackDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy góp ý với ID: " + id));
            
            if (status < 0 || status > 2) {
                return new ResponseEntity<>("Trạng thái không hợp lệ", HttpStatus.BAD_REQUEST);
            }
            
            feedback.setStatus(status);
            feedbackDAO.save(feedback);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Cập nhật trạng thái góp ý thành công");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return new ResponseEntity<>("Đã xảy ra lỗi: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/respond/{id}")
    public ResponseEntity<?> respondToFeedback(@PathVariable Integer id, @RequestBody FeedbackResponseRequest responseRequest) {
        try {
            Feedback feedback = feedbackDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy góp ý với ID: " + id));
            
            // Send response email
            emailUtil.sendFeedbackResponseEmail(
                feedback.getEmail(), 
                feedback.getMessage(),
                responseRequest.getResponse()
            );
            
            // Update feedback status to "Đã xử lý"
            feedback.setStatus(2);
            feedbackDAO.save(feedback);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Đã gửi phản hồi thành công");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return new ResponseEntity<>("Đã xảy ra lỗi: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
