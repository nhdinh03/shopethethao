package com.shopethethao.auth.payload.password.request;

import lombok.Data;


@Data
public class ChangePasswordRequest {
    private String id;
    private String oldPassword;
    private String newPassword;
    private String confirmNewPassword;
}
