package com.shopethethao.auth.OTP.util;

import com.shopethethao.auth.models.SecurityAccount;

import org.springframework.security.crypto.password.PasswordEncoder;

public class AccountValidationUtil {

    public static void validateAccount(SecurityAccount account, String password, PasswordEncoder encoder) {
        if (!account.isVerified()) {
            throw new AccountNotVerifiedException("Tài khoản chưa được xác thực. Vui lòng xác thực email của bạn!");
        }
        if (account.getStatus() == 0) {
            throw new AccountLockedException("Tài khoản bạn bị khóa, vui lòng liên hệ quản trị viên!");
        }
        if (!encoder.matches(password, account.getPassword())) {
            throw new InvalidCredentialsException("Sai mật khẩu, vui lòng kiểm tra lại!");
        }
    }
}
