package com.shopethethao.auth.payload.password.request;


import lombok.Data;

@Data
public class ForgotPassword {
    String code;
    String newPassword;
}
