package com.shopethethao.dto;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

  private String id;
  private String phone;
  private String fullname;
  private String email;
  private String address;
  private Date birthday;
  private Boolean gender;
  private String image;

  // Constructor
  public UserDto(String id, String phone, String fullname, String email, String address, Date birthday, Boolean gender,
      String image, String type, List<String> roles) {
    this.id = id;
    this.phone = phone;
    this.fullname = fullname;
    this.email = email;
    this.address = address;
    this.birthday = birthday;
    this.gender = gender;
    this.image = image;
  }

}
