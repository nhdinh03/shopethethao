package com.shopethethao.auth.OTP.util;

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

  // Phương thức trợ giúp để tạo nội dung HTML cho email
  private String createHtmlContent(String message, String dynamicPart) {
    return "<!DOCTYPE html>" +
        "<html lang='en'>" +
        "<head>" +
        "<meta charset='UTF-8'>" +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
        "<style>" +
        "body { font-family: 'Roboto', Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }" +
        ".container { max-width: 650px; margin: 30px auto; padding: 25px; background: linear-gradient(145deg, #ffffff, #f0f0f0); border-radius: 15px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); }"
        +
        ".header { text-align: center; background-color: #0078d4; color: #fff; padding: 25px 20px; border-radius: 15px 15px 0 0; }"
        +
        ".header h1 { font-size: 24px; margin: 0; font-weight: bold; letter-spacing: 1px; }" +
        ".content { padding: 20px; text-align: center; line-height: 1.6; color: #333; font-size: 16px; }" +
        ".dynamic-part { font-size: 22px; font-weight: 600; color: #0078d4; margin-top: 20px; display: inline-block; }"
        +
        ".footer { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }" +
        "@media only screen and (max-width: 600px) {" +
        ".container { padding: 15px; }" +
        ".header h1 { font-size: 20px; }" +
        ".content { font-size: 14px; }" +
        ".dynamic-part { font-size: 18px; }" +
        ".footer { font-size: 12px; }" +
        "}" +
        "</style>" +
        "</head>" +
        "<body>" +
        "<div class='container'>" +
        "<div class='header'><h1>Shope Thể Thao Nhdinh</h1></div>" +
        "<div class='content'>" +
        "<p>" + message + "</p>" +
        "<span class='dynamic-part'>" + dynamicPart + "</span>" +
        "</div>" +
        "<div class='footer'>Cảm ơn bạn đã tin tưởng Shop Thể Thao Nhdinh!</div>" +
        "</div>" +
        "</body>" +
        "</html>";
  }

}
