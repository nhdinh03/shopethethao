package com.shopethethao.auth.OTP.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import org.thymeleaf.spring6.SpringTemplateEngine;


@Component
public class EmailUtil {
  @Autowired
  private SpringTemplateEngine thymeleafTemplateEngine;
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
        "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }"
        +
        ".container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }"
        +
        ".header { text-align: center; background-color: #0056b3; color: #fff; padding: 20px; }" +
        ".header h1 { margin: 0; }" +
        ".content { padding: 20px; text-align: center; }" +
        ".dynamic-part { font-size: 20px; font-weight: bold; color: #0056b3; margin-top: 20px; }" +
        "</style>" +
        "</head>" +
        "<body>" +
        "<div class='container'>" +
        "<div class='header'><h1>TicketEz</h1></div>" +
        "<div class='content'>" +
        "<p>" + message + "<span class='dynamic-part'>" + dynamicPart + "</span></p>" +
        "</div>" +
        "</div>" +
        "</body>" +
        "</html>";
  }
}
