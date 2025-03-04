package com.shopethethao.auth.otp.util;

import com.shopethethao.modules.account.Account;

import org.springframework.security.crypto.password.PasswordEncoder;

public class AccountValidationUtil {

    public static void validateAccount(Account account, String password, PasswordEncoder encoder) {
        if (!account.getVerified()) {
            throw new AccountNotVerifiedException(
                "Tài khoản chưa được xác thực: Vui lòng thực hiện xác thực tài khoản để đăng nhập !.");
        }
        
        if (account.getStatus() == 0) {
            throw new AccountLockedException(
                "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.");
        }
        
        if (!encoder.matches(password, account.getPassword())) {
            throw new InvalidCredentialsException(
                "Mật khẩu không chính xác. Vui lòng kiểm tra lại.");
        }
    }
}
