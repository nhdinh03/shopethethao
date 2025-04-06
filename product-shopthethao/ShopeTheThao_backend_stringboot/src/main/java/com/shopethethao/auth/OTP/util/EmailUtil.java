package com.shopethethao.auth.otp.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.shopethethao.modules.products.Product;

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

  public void sendNewProductEmail(String to, Product product) throws MessagingException {
    String subject = "Sản phẩm mới tại Shop Thể Thao Nhdinh";
    String htmlContent = createNewProductEmailContent(product);
    sendEmail(to, subject, htmlContent);
  }

  private String createNewProductEmailContent(Product product) {
    // Lấy danh sách hình ảnh
    List<String> imageUrls = new ArrayList<>();
    if (product.getImages() != null && !product.getImages().isEmpty()) {
        // Lấy tối đa 3 hình ảnh
        product.getImages().stream()
            .limit(3)
            .filter(img -> img.getImageUrl() != null && !img.getImageUrl().trim().isEmpty())
            .forEach(img -> imageUrls.add(img.getImageUrl()));
    }
    
    if (imageUrls.isEmpty()) {
        imageUrls.add("https://via.placeholder.com/600x400?text=Ch%C6%B0a%20c%C3%B3%20h%C3%ACnh%20%E1%BA%A3nh");
    }

    // Format giá sản phẩm
    String formattedPrice = String.format("%,.0f", product.getPrice());
    
    // Tạo gallery hình ảnh
    StringBuilder imageGallery = new StringBuilder();
    if (imageUrls.size() == 1) {
        // Hiển thị 1 hình ảnh lớn
        imageGallery.append(String.format(
            "<div style='text-align: center; margin-bottom: 20px;'>" +
            "<img src='%s' alt='%s' style='width: 100%%; max-width: 600px; height: auto; border-radius: 8px;'>" +
            "</div>",
            imageUrls.get(0),
            product.getName()
        ));
    } else {
        // Hiển thị nhiều hình ảnh dạng gallery
        imageGallery.append("<div style='display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;'>");
        for (String url : imageUrls) {
            imageGallery.append(String.format(
                "<div style='flex: 1; min-width: 30%%; max-width: 32%%; border-radius: 8px; overflow: hidden;'>" +
                "<img src='%s' alt='%s' style='width: 100%%; height: 150px; object-fit: cover;'>" +
                "</div>",
                url,
                product.getName()
            ));
        }
        imageGallery.append("</div>");
    }
    
    // Chuẩn bị thông tin kích thước
    StringBuilder sizesInfo = new StringBuilder();
    if (product.getSizes() != null && !product.getSizes().isEmpty()) {
        sizesInfo.append("<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>");
        sizesInfo.append("<thead style='background-color: #f8f9fa;'>");
        sizesInfo.append("<tr>");
        sizesInfo.append("<th style='padding: 12px; text-align: left; border: 1px solid #dee2e6;'>Kích thước</th>");
        sizesInfo.append("<th style='padding: 12px; text-align: center; border: 1px solid #dee2e6;'>Số lượng</th>");
        sizesInfo.append("<th style='padding: 12px; text-align: right; border: 1px solid #dee2e6;'>Giá bán</th>");
        sizesInfo.append("</tr>");
        sizesInfo.append("</thead>");
        sizesInfo.append("<tbody>");
        
        // Sắp xếp theo tên size
        product.getSizes().stream()
            .sorted((a, b) -> {
                if (a.getSize() == null || b.getSize() == null || 
                    a.getSize().getName() == null || b.getSize().getName() == null) {
                    return 0;
                }
                return a.getSize().getName().compareTo(b.getSize().getName());
            })
            .forEach(size -> {
                String sizeName = size.getSize() != null && size.getSize().getName() != null ? 
                    size.getSize().getName() : "Chưa xác định";
                    
                sizesInfo.append(String.format(
                    "<tr>" +
                    "<td style='padding: 12px; text-align: left; border: 1px solid #dee2e6;'>%s</td>" +
                    "<td style='padding: 12px; text-align: center; border: 1px solid #dee2e6;'>%d</td>" +
                    "<td style='padding: 12px; text-align: right; border: 1px solid #dee2e6; color: #e41e31;'>%,d ₫</td>" +
                    "</tr>",
                    sizeName,
                    size.getQuantity(),
                    size.getPrice()
                ));
            });
            
        sizesInfo.append("</tbody>");
        sizesInfo.append("</table>");
    } else {
        sizesInfo.append("<p style='color: #666; font-style: italic; margin-top: 20px;'>Chưa có thông tin kích thước</p>");
    }
    
    // Tạo nội dung HTML với CSS inline
    return String.format("""
        <!DOCTYPE html>
        <html lang='vi'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Sản phẩm mới tại Shop Thể Thao Nhdinh</title>
        </head>
        <body style='font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;'>
            <div style='max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);'>
                <!-- Header -->
                <div style='background: linear-gradient(135deg, #e41e31 0%%, #c11b19 100%%); padding: 24px; text-align: center;'>
                    <h1 style='color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;'>SẢN PHẨM MỚI</h1>
                    <p style='color: #ffffff; opacity: 0.9; margin-top: 5px;'>Shop Thể Thao Nhdinh</p>
                </div>
                
                <!-- Main Content -->
                <div style='padding: 30px;'>
                    <!-- Product Title -->
                    <h2 style='font-size: 24px; margin-top: 0; margin-bottom: 5px; color: #222;'>%s</h2>
                    
                    <!-- Category Badge -->
                    <div style='margin-bottom: 20px;'>
                        <span style='display: inline-block; background-color: #0f5bff; color: white; padding: 5px 12px; border-radius: 30px; font-size: 13px; font-weight: 500;'>%s</span>
                    </div>
                    
                    <!-- Image Gallery -->
                    %s
                    
                    <!-- Product Price -->
                    <div style='background-color: #f9f9f9; border-left: 4px solid #e41e31; padding: 15px; margin-bottom: 15px;'>
                        <p style='margin: 0; font-size: 14px; color: #666;'>Giá niêm yết:</p>
                        <div style='font-size: 26px; font-weight: 700; color: #e41e31;'>%s ₫</div>
                    </div>
                    
                    <!-- Description -->
                    <div style='margin-bottom: 25px;'>
                        <h3 style='font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;'>Mô tả sản phẩm</h3>
                        <p style='line-height: 1.6; color: #444;'>%s</p>
                    </div>
                    
                    <!-- Sizes & Prices -->
                    <div style='margin-bottom: 30px;'>
                        <h3 style='font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;'>Kích thước & Giá</h3>
                        %s
                    </div>
                    
                    <!-- CTA Button -->
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='http://localhost:4200/products/%d' style='display: inline-block; background-color: #e41e31; color: white; font-weight: 600; padding: 14px 30px; text-decoration: none; border-radius: 30px; font-size: 16px;'>XEM CHI TIẾT SẢN PHẨM</a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;'>
                    <!-- Social Media Links -->
                    <div style='margin-bottom: 15px;'>
                        <a href='https://www.facebook.com/nhdinh03' style='display: inline-block; margin: 0 10px; color: #3b5998; text-decoration: none;'>
                            <span>Facebook</span>
                        </a>
                        <a href='https://www.instagram.com/nhdinhdz' style='display: inline-block; margin: 0 10px; color: #e1306c; text-decoration: none;'>
                            <span>Instagram</span>
                        </a>
                        <a href='https://www.tiktok.com/@nhdinhdz' style='display: inline-block; margin: 0 10px; color: #000000; text-decoration: none;'>
                            <span>TikTok</span>
                        </a>
                    </div>
                    
                    <!-- Address & Copyright -->
                    <p style='color: #666; font-size: 13px; margin-bottom: 5px;'>Địa chỉ: 65 A2, An Sơn, Thống Nhất, Nha Trang, Khánh Hòa</p>
                    <p style='color: #666; font-size: 13px; margin: 0;'>© %d Shop Thể Thao Nhdinh. Bản quyền thuộc về Nhdinh.</p>
                </div>
            </div>
            
            <!-- Unsubscribe text at bottom -->
            <div style='max-width: 650px; margin: 10px auto; text-align: center; font-size: 12px; color: #999;'>
                <p>Email này được gửi tự động để thông báo về sản phẩm mới. Nếu bạn không muốn nhận email này nữa, vui lòng <a href='http://localhost:4200/account/unsubscribe' style='color: #666;'>hủy đăng ký</a>.</p>
            </div>
        </body>
        </html>
        """,
        // Thông tin sản phẩm
        product.getName(),
        product.getCategorie() != null && product.getCategorie().getName() != null ? 
            product.getCategorie().getName() : "Sản phẩm mới",
        imageGallery.toString(),
        formattedPrice,
        product.getDescription() != null ? product.getDescription() : "Chưa có mô tả",
        sizesInfo.toString(),
        product.getId(),
        java.time.LocalDate.now().getYear()
    );
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
