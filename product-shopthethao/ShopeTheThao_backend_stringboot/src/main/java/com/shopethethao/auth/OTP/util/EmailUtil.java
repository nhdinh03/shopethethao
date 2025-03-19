package com.shopethethao.auth.otp.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtil {
  @Autowired

  private final JavaMailSender javaMailSender;

  public EmailUtil(JavaMailSender javaMailSender) {
    this.javaMailSender = javaMailSender;
  }

  // Phương thức chung để gửi email
  public void sendEmail(String to, String subject, String htmlContent) throws MessagingException {
    MimeMessage mimeMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(htmlContent, true);

    javaMailSender.send(mimeMessage);
  }

  // Tạo nội dung email OTP và gửi
  public void sendOtpEmail(String to, String otp) throws MessagingException {
    String subject = "Shope Thể  Thao Nhdinh OTP";
    String htmlContent = createHtmlContent("Mã OTP của bạn là: ", otp);
    sendEmail(to, subject, htmlContent);
  }

  // Phương thức gửi email góp ý từ khách hàng
  public void sendFeedbackEmail(String fromEmail, String feedbackMessage) throws MessagingException {
    String adminEmail = "nhdinhpc03@gmail.com"; // Email của admin
    String subject = "Góp ý từ khách hàng - Shop Thể Thao Nhdinh";
    String htmlContent = createFeedbackHtmlContent(fromEmail, feedbackMessage);
    
    MimeMessage mimeMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
    helper.setTo(adminEmail);
    helper.setSubject(subject);
    helper.setText(htmlContent, true);
    helper.setReplyTo(fromEmail); // Set Reply-To để có thể phản hồi trực tiếp

    javaMailSender.send(mimeMessage);
  }

  // Phương thức gửi email phản hồi góp ý
  public void sendFeedbackResponseEmail(String email, String originalMessage, String response) throws MessagingException {
    String subject = "Phản hồi góp ý của bạn - ShopTheThao";
    String content = String.format("""
        Kính gửi quý khách,
        
        Cảm ơn bạn đã gửi góp ý cho ShopTheThao. Dưới đây là phản hồi của chúng tôi:
        
        Góp ý của bạn:
        "%s"
        
        Phản hồi của chúng tôi:
        "%s"
        
        Trân trọng,
        ShopTheThao Team
        """, originalMessage, response);
        
    sendEmail(email, subject, content);
  }

  // Phương thức trợ giúp để tạo nội dung HTML cho email
  private String createHtmlContent(String message, String dynamicPart) {
    return "<!DOCTYPE html>" +
        "<html lang='en'>" +
        "<head>" +
        "<meta charset='UTF-8'>" +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
        "<style>" +
        "body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
        ".container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }" +
        ".header { background: linear-gradient(135deg, #0052cc, #0078d4); padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }" +
        ".header img { width: 150px; height: auto; margin-bottom: 15px; }" +
        ".header h1 { color: #ffffff; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }" +
        ".content { padding: 40px 30px; color: #333333; }" +
        ".message-box { background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 20px 0; text-align: center; }" +
        ".otp-code { font-size: 32px; font-weight: bold; color: #0052cc; letter-spacing: 5px; margin: 15px 0; display: block; }" +
        ".notice { font-size: 14px; color: #666666; margin: 15px 0; line-height: 1.6; }" +
        ".footer { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; }" +
        ".social-links { margin: 20px 0; }" +
        ".social-links a { color: #0052cc; text-decoration: none; margin: 0 10px; }" +
        ".warning { color: #dc3545; font-size: 13px; margin-top: 15px; }" +
        "@media only screen and (max-width: 600px) {" +
        "  .container { margin: 10px; }" +
        "  .header h1 { font-size: 24px; }" +
        "  .content { padding: 20px; }" +
        "  .otp-code { font-size: 28px; }" +
        "}" +
        "</style>" +
        "</head>" +
        "<body>" +
        "<div class='container'>" +
        "  <div class='header'>" +
        "    <h1>Shop Thể Thao Nhdinh</h1>" +
        "  </div>" +
        "  <div class='content'>" +
        "    <h2>Xác thực tài khoản</h2>" +
        "    <p>Xin chào quý khách,</p>" +
        "    <div class='message-box'>" +
        "      <p>" + message + "</p>" +
        "      <span class='otp-code'>" + dynamicPart + "</span>" +
        "      <p class='notice'>Mã OTP có hiệu lực trong vòng 1 phút.</p>" +
        "    </div>" +
        "    <p class='warning'>Vui lòng không chia sẻ mã này với bất kỳ ai.</p>" +
        "  </div>" +
        "  <div class='footer'>" +
        "    <p>Cảm ơn bạn đã tin tưởng Shop Thể Thao Nhdinh!</p>" +
        "    <div class='social-links'>" +
        "      <a href='https://www.facebook.com/nhdinh03'>Facebook</a> | " +
        "      <a href='instagram.com/nhdinhdz'>Instagram</a> | " +
        "      <a href='https://www.tiktok.com/@nhdinhdz'>TikTok</a>" +
        "    </div>" +
        "    <p>© 2025 Shop Thể Thao Nhdinh. All rights reserved.</p>" +
        "  </div>" +
        "</div>" +
        "</body>" +
        "</html>";
  }

  // Tạo nội dung HTML cho email góp ý
  private String createFeedbackHtmlContent(String fromEmail, String feedbackMessage) {
    return "<!DOCTYPE html>" +
        "<html lang='en'>" +
        "<head>" +
        "<meta charset='UTF-8'>" +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
        "<style>" +
        "body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
        ".container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }" +
        ".header { background: linear-gradient(135deg, #0052cc, #0078d4); padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }" +
        ".header h1 { color: #ffffff; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }" +
        ".content { padding: 40px 30px; color: #333333; }" +
        ".message-box { background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 20px 0; }" +
        ".message-header { font-weight: bold; margin-bottom: 10px; color: #0052cc; }" +
        ".message-content { white-space: pre-line; line-height: 1.6; }" +
        ".customer-info { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }" +
        ".footer { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; }" +
        "</style>" +
        "</head>" +
        "<body>" +
        "<div class='container'>" +
        "  <div class='header'>" +
        "    <h1>Góp Ý Khách Hàng</h1>" +
        "  </div>" +
        "  <div class='content'>" +
        "    <p>Bạn đã nhận được góp ý mới từ khách hàng:</p>" +
        "    <div class='message-box'>" +
        "      <div class='message-header'>Nội dung góp ý:</div>" +
        "      <div class='message-content'>" + feedbackMessage.replace("\n", "<br/>") + "</div>" +
        "    </div>" +
        "    <div class='customer-info'>" +
        "      <p><strong>Email khách hàng:</strong> " + fromEmail + "</p>" +
        "      <p><strong>Thời gian gửi:</strong> " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")) + "</p>" +
        "    </div>" +
        "  </div>" +
        "  <div class='footer'>" +
        "    <p>© " + java.time.LocalDate.now().getYear() + " Shop Thể Thao Nhdinh. All rights reserved.</p>" +
        "  </div>" +
        "</div>" +
        "</body>" +
        "</html>";
  }

}
