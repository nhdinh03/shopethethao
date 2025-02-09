package com.shopethethao.auth.payload.response;

import java.util.Date;
import java.util.List;

import com.shopethethao.auth.models.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO {

  private String id;
  private String phone;
  private String fullname;
  private String image;

  private String email;
  private String address;
  private Date birthday;
  private Gender gender;

  private List<String> roles;
  private String token;
  private String type = "Bearer";

  public JwtResponseDTO(String id, String phone, String fullname, String email,
      String address, Date birthday, String gender, // ✅ Chấp nhận String
      String image, String accessToken, String type, List<String> roles) {
    this.id = id;
    this.phone = phone;
    this.fullname = fullname;
    this.image = image;
    this.email = email;
    this.address = address;
    this.birthday = birthday;
    this.gender = (gender != null && !gender.equals("Không xác định"))
        ? Gender.valueOf(gender.toUpperCase())
        : null; // ✅ Chuyển đổi từ String sang ENUM hoặc để null nếu không xác định
    this.roles = roles;
    this.token = accessToken;
    this.type = type;
  }

}
