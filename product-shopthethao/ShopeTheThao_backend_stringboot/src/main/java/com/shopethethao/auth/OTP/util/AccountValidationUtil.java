package com.shopethethao.auth.otp.util;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.auth.security.user.entity.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public static Account findAndValidateAccount(String loginValue, AccountDAO accountDAO) {
        if (loginValue == null || loginValue.trim().isEmpty()) {
            throw new IllegalArgumentException("ID hoặc số điện thoại không được để trống");
        }

        return accountDAO.findById(loginValue.trim())
                .orElseGet(() -> accountDAO.findByPhone(loginValue.trim())
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "Không tìm thấy tài khoản với ID hoặc số điện thoại này " + loginValue)));
    }

    public static Authentication authenticateUser(Account account, String password, AuthenticationManager authenticationManager) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(account.getId(), password));

            if (!(authentication.getPrincipal() instanceof UserDetailsImpl)) {
                throw new RuntimeException("Lỗi hệ thống: Không thể xác thực người dùng");
            }

            return authentication;

        } catch (Exception e) {
            throw new InvalidCredentialsException("Thông tin đăng nhập không chính xác");
        }
    }
}
