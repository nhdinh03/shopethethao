package com.shopethethao.auth.payload.request;


import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ForgotPassword {
    String code;
    String newPassword;
}
