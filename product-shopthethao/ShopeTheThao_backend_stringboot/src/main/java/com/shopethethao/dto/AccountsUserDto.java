package com.shopethethao.dto;

import java.time.LocalDate;
import java.util.Set;

import com.shopethethao.modules.account.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountsUserDto {

    @NotBlank(message = "ID không được để trống!")
    private String id;

    @NotBlank(message = "Họ tên không được để trống!")
    private String fullname;

    @NotBlank(message = "Số điện thoại không được để trống!")
    private String phone;

    @NotBlank(message = "Email không được để trống!")
    @Email(message = "Email không hợp lệ!")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống!")
    @Size(min = 8, max = 40, message = "Mật khẩu phải có độ dài từ 8 đến 40 ký tự!")
    private String password;

    private String address;

    private LocalDate birthday;  // Đã sửa đúng kiểu dữ liệu

    private Gender gender;

    private Boolean verified = false;

    private Integer points = 0;
    

    private String image;

    private Set<String> role;
}
