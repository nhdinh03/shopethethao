package com.shopethethao.auth.controllers;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.shopethethao.auth.otp.util.AccountValidationUtil;
import com.shopethethao.auth.otp.util.EmailUtil;
import com.shopethethao.auth.otp.util.OtpUtil;
import com.shopethethao.auth.payload.auth.request.LoginRequest;
import com.shopethethao.auth.payload.auth.request.SignupRequest;
import com.shopethethao.auth.payload.otp.request.NewOtp;
import com.shopethethao.auth.payload.password.request.ChangePasswordRequest;
import com.shopethethao.auth.payload.password.request.ForgotPassword;
import com.shopethethao.auth.payload.response.JwtResponseDTO;
import com.shopethethao.auth.payload.response.MessageResponse;
import com.shopethethao.auth.payload.response.TokenRefreshResponse;
import com.shopethethao.auth.security.jwt.util.JwtUtils;
import com.shopethethao.auth.security.token.RefreshTokenService;
import com.shopethethao.auth.security.token.TokenManager;
import com.shopethethao.auth.security.token.TokenRefreshException;
import com.shopethethao.auth.security.token.TokenRefreshRequest;
import com.shopethethao.auth.security.token.TokenStore;
import com.shopethethao.auth.security.user.entity.UserDetailsImpl;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.modules.refreshToken.RefreshToken;
import com.shopethethao.modules.role.Role;
import com.shopethethao.modules.role.RoleDAO;
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.userHistory.UserHistoryService;
import com.shopethethao.modules.role.ERole;
import com.shopethethao.modules.verification.Verifications;
import com.shopethethao.modules.verification.VerificationsDAO;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AccountDAO accountDAO;

    @Autowired
    RoleDAO roleRepository;

    @Autowired
    private VerificationsDAO verificationDAO;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private OtpUtil otpUtil;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    TokenStore tokenStore;

    @Autowired
    TokenManager tokenManager;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserHistoryService userHistoryService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {
        try {
            // ✅ Kiểm tra nếu ID/Phone bị null hoặc trống
            if (loginRequest.getId() == null || loginRequest.getId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("ID hoặc số điện thoại không hợp lệ");
            }

            String loginValue = loginRequest.getId().trim();

            // ✅ Tìm tài khoản bằng ID trước, nếu không có thì tìm bằng phone
            Account account = accountDAO.findById(loginValue)
                    .orElseGet(() -> accountDAO.findByPhone(loginValue)
                            .orElseThrow(() -> new UsernameNotFoundException(
                                    "Không tìm thấy người dùng với ID hoặc phone: " + loginValue)));

            // ✅ Kiểm tra tài khoản có bị khóa hay chưa xác minh không
            AccountValidationUtil.validateAccount(account, loginRequest.getPassword(), encoder);

            Authentication authentication;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(account.getId(), loginRequest.getPassword()));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Sai thông tin đăng nhập hoặc token không hợp lệ");
            }

            // ✅ Kiểm tra `authentication.getPrincipal()`
            if (!(authentication.getPrincipal() instanceof UserDetailsImpl)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Lỗi xác thực, không thể lấy thông tin người dùng");
            }

            // ✅ Lấy thông tin từ `UserDetailsImpl`
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Trước khi tạo token mới, xóa hết token cũ
            String userId = userDetails.getId();
            tokenManager.removeAllTokensForUser(userId);
            tokenStore.invalidateToken(userId);
            refreshTokenService.deleteByAccountId(userId);

            // Tạo token mới
            String jwt = jwtUtils.generateJwtToken(authentication);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userId);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            tokenStore.saveNewToken(userDetails.getId(), jwt);

            // ✅ Xử lý `gender` để tránh lỗi `NullPointerException`
            String gender = (userDetails.getGender() != null) ? userDetails.getGender().toString() : "Không xác định";

            // Thêm try-catch cho việc ghi log
            try {
                userHistoryService.logUserAction(
                        userDetails.getId(),
                        UserActionType.LOGIN,
                        "Đăng nhập thành công",
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent"));
            } catch (Exception e) {
                // Log lỗi nhưng vẫn cho phép đăng nhập thành công
                logger.error("Failed to log login action", e);
            }

            // ✅ Trả về JWT và thông tin người dùng
            return ResponseEntity.ok(new JwtResponseDTO(
                    userDetails.getId(),
                    userDetails.getPhone(),
                    userDetails.getFullname(),
                    userDetails.getEmail(),
                    userDetails.getAddress(),
                    userDetails.getBirthday(),
                    gender,
                    userDetails.getImage(),
                    jwt,
                    refreshToken.getToken(), // Thêm refresh token vào response
                    "Bearer",
                    roles));
        } catch (Exception e) {
            // Log thất bại đăng nhập
            try {
                userHistoryService.logUserAction(
                        loginRequest.getId(),
                        UserActionType.LOGIN_FAILED,
                        "Đăng nhập thất bại: " + e.getMessage(),
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent"));
            } catch (Exception logError) {
                logger.error("Failed to log failed login attempt", logError);
            }

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Đăng nhập thất bại: " + e.getMessage()));
        }
    }

    // Thêm endpoint để refresh token
    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(token -> {
                    refreshTokenService.verifyExpiration(token);
                    String newToken = jwtUtils.generateTokenFromUsername(token.getAccount().getId());
                    return ResponseEntity.ok(new TokenRefreshResponse(newToken, requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token không có trong database!"));
    }

    @Transactional // Transactional OTP chỉ được lưu khi tất cả các thao tác thành công:
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // ✅ Kiểm tra xem ID, email hoặc phone có bị trùng không
        if (accountDAO.existsById(signUpRequest.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Tên người dùng đã tồn tại!"));
        }
        if (accountDAO.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email đã được sử dụng!"));
        }
        if (accountDAO.existsByPhone(signUpRequest.getPhone())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Số điện thoại đã được sử dụng!"));
        }

        // ✅ Tạo tài khoản mới
        Account account = new Account(
                signUpRequest.getId(),
                signUpRequest.getPhone(),
                signUpRequest.getFullname(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        account.setGender(signUpRequest.getGender());
        account.setStatus(1);
        account.setCreatedDate(new Date());
        account.setVerified(false);

        // ✅ Xử lý vai trò (ROLE)
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.USER)
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                ERole roleEnum = ERole.fromString(role);
                Role securityRole = roleRepository.findByName(roleEnum)
                        .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò - " + role));
                roles.add(securityRole);
            });
        }
        account.setRoles(roles);

        // ✅ Gửi OTP qua email
        String otp = otpUtil.generateOtp();
        try {
            emailUtil.sendOtpEmail(signUpRequest.getEmail(), otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi OTP, vui lòng thử lại sau!");
        }

        // ✅ Tạo Verifications
        Verifications verifications = new Verifications();
        verifications.setAccount(account);
        verifications.setCode(otp);
        verifications.setActive(false);
        verifications.setCreatedAt(LocalDateTime.now());
        verifications.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        account.setVerifications(Collections.singletonList(verifications));

        accountDAO.save(account);

        return ResponseEntity
                .ok(new MessageResponse("Người dùng đã đăng ký thành công, vui lòng kiểm tra email để xác thực!"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        Account securityAccount = accountDAO.findById(changePasswordRequest.getId())
                .orElseThrow(
                        () -> new UsernameNotFoundException("Không tìm thấy người dùng "
                                + changePasswordRequest.getId()));
        if (!encoder.matches(changePasswordRequest.getOldPassword(),
                securityAccount.getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Mật khẩu cũ không đúng!"));
        }
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmNewPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Mật khẩu mới và mật khẩu xác nhận không khớp"));
        }
        securityAccount.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
        accountDAO.save(securityAccount);
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Đổi Mật khẩu thành công"));

    }

    @PostMapping("/verify-account")
    public ResponseEntity<?> verifyOtp(@RequestBody LoginRequest loginRequest) {
        Account securityAccount = accountDAO.findById(loginRequest.getId())
                .orElseThrow(
                        () -> new RuntimeException("Không tìm thấy người dùng với id này: " + loginRequest.getId()));
        List<Verifications> verifications = verificationDAO.findByAccountId(securityAccount.getId());
        boolean isOtpValid = false;
        for (Verifications verification : verifications) {
            if (verification.getCode().equals(loginRequest.getOtp())) {
                // Kiểm tra xem OTP có hết hạn hay không
                if (verification.getExpiresAt().isAfter(LocalDateTime.now())) {
                    verification.setActive(true);
                    verificationDAO.save(verification);
                    securityAccount.setVerified(true);
                    accountDAO.save(securityAccount);
                    isOtpValid = true;
                    break; // Dừng vòng lặp nếu OTP hợp lệ
                } else {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới."));
                }
            }
        }

        if (!isOtpValid) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Mã OTP không chính xác hoặc không tồn tại."));
        }

        return ResponseEntity.ok().body(new MessageResponse("Tài khoản đã được xác thực thành công."));
    }

    @PutMapping("/regenerate-otp")
    public ResponseEntity<?> regenerateOtp(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email không được để trống!"));
        }
        Optional<Account> securityAccountOpt = accountDAO.findByEmail(email);

        if (!securityAccountOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Không tìm thấy người dùng với email này: " + email));
        }
        Account securityAccount = securityAccountOpt.get();
        String otp = otpUtil.generateOtp();
        try {
            emailUtil.sendOtpEmail(email, otp);
        } catch (MessagingException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Không thể gửi OTP qua email, vui lòng thử lại sau."));
        }
        // Cập nhật hoặc tạo mới Verification
        List<Verifications> verifications = verificationDAO.findByAccountId(securityAccount.getId());
        if (!verifications.isEmpty()) {
            for (Verifications verification : verifications) {
                verification.setCode(otp);
                verification.setExpiresAt(LocalDateTime.now().plusMinutes(1));
                verificationDAO.save(verification);
            }
        } else {
            Verifications newVerification = new Verifications();
            newVerification.setCode(otp);
            newVerification.setExpiresAt(LocalDateTime.now().plusMinutes(1));
            verificationDAO.save(newVerification);
        }

        return ResponseEntity
                .ok(new MessageResponse("Mã OTP đã được cập nhật. Vui lòng xác minh tài khoản trong vòng 1 phút."));
    }

    // // profile
    // @PutMapping("/{id}")
    // public ResponseEntity<?> updateAccount(@PathVariable String id, @Valid
    // @RequestBody UserDto userDto) {
    // Optional<Account> existingAccountOpt =
    // accountDAO.findById(id);
    // if (!existingAccountOpt.isPresent()) {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản không được
    // tìm thấy");
    // }
    // Account existingAccount = existingAccountOpt.get();
    // if (!existingAccount.getPhone().equals(userDto.getPhone()) &&
    // accountDAO.existsByPhone(userDto.getPhone())) {
    // return ResponseEntity
    // .badRequest()
    // .body(new MessageResponse("Số điện thoai đã được sử dụng!"));
    // }
    // if (!existingAccount.getEmail().equals(userDto.getEmail()) &&
    // accountDAO.existsByEmail(userDto.getEmail())) {
    // return ResponseEntity
    // .badRequest()
    // .body(new MessageResponse("Email đã được sử dụng!"));
    // }
    // existingAccount.setPhone(userDto.getPhone());
    // existingAccount.setFullname(userDto.getFullname());
    // existingAccount.setEmail(userDto.getEmail());
    // existingAccount.setAddress(userDto.getAddress());
    // existingAccount.setBirthday(userDto.getBirthday());
    // existingAccount.setGender(userDto.getGender());
    // existingAccount.setImage(userDto.getImage());
    // Account updatedAccount = accountDAO.save(existingAccount);
    // UserDto responseDto = new UserDto(
    // updatedAccount.getId(),
    // updatedAccount.getPhone(),
    // updatedAccount.getFullname(),
    // updatedAccount.getEmail(),
    // updatedAccount.getAddress(),
    // updatedAccount.getBirthday(),
    // updatedAccount.getGender(),
    // updatedAccount.getImage());
    // return ResponseEntity.ok(responseDto);
    // }
    // Gửi email quên mật khẩu
    @PutMapping("/forgot-password")
    public ResponseEntity<?> sendForgotPasswordEmail(@RequestBody NewOtp newOtp) {
        Optional<Account> userOpt = accountDAO.findByEmail(newOtp.getEmail());
        if (!userOpt.isPresent()) {
            return ResponseEntity.ok(new MessageResponse("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi."));
        }
        Account user = userOpt.get();
        String code = otpUtil.generateOtp(); // Tạo OTP mới
        Verifications verification = verificationDAO.findByAccountId(user.getId())
                .stream()
                .findFirst()
                .orElse(new Verifications());
        verification.setAccountId(user.getId());
        verification.setCode(code);
        verification.setCreatedAt(LocalDateTime.now());
        verification.setActive(true);
        verificationDAO.save(verification); // Lưu OTP vào cơ sở dữ liệu

        try {
            emailUtil.sendOtpEmail(newOtp.getEmail(), code);
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Không thể gửi email. Vui lòng thử lại sau."));
        }

        return ResponseEntity.ok(new MessageResponse("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi."));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ForgotPassword forgotPassword) {

        Verifications verification = verificationDAO.findByCode(forgotPassword.getCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "OTP không hợp lệ hoặc không tồn tại."));

        if (Duration.between(verification.getCreatedAt(), LocalDateTime.now()).getSeconds() > 1000) {
            verification.setActive(false);
            verificationDAO.save(verification);
            return ResponseEntity.badRequest().body(new MessageResponse("OTP đã hết hạn."));
        }

        Account user = accountDAO.findById(verification.getAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));

        user.setPassword(encoder.encode(forgotPassword.getNewPassword()));
        accountDAO.save(user);

        // Hủy hiệu lực OTP
        verification.setActive(false);
        verificationDAO.save(verification);

        return ResponseEntity.ok(new MessageResponse("Mật khẩu đã được cập nhật thành công."));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Account>> findAll() {
        List<Account> accounts = accountDAO.findAll();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Account> findByEmail(@PathVariable String email) {
        Optional<Account> optionalAccount = accountDAO.findByEmail(email);
        return optionalAccount.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            String userId = null;
            
            if (token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                try {
                    userId = jwtUtils.getUserNameFromJwtToken(jwt);
                    // Xóa tokens
                    cleanupUserTokens(userId);
                    // Log action
                    logUserLogout(userId, request);
                } catch (Exception e) {
                    logger.warn("Token parsing failed during logout: {}", e.getMessage());
                }
            }

            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(new MessageResponse("Đăng xuất thành công"));
            
        } catch (Exception e) {
            logger.error("Logout error: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(new MessageResponse("Đăng xuất hoàn tất"));
        }
    }

    private void cleanupUserTokens(String userId) {
        try {
            refreshTokenService.deleteByAccountId(userId);
            tokenStore.invalidateToken(userId);
            tokenManager.removeToken(userId);
        } catch (Exception e) {
            logger.error("Token cleanup failed for user {}: {}", userId, e.getMessage());
        }
    }

    private void logUserLogout(String userId, HttpServletRequest request) {
        try {
            userHistoryService.logUserAction(
                userId,
                UserActionType.LOGOUT,
                "Đăng xuất thành công",
                request.getRemoteAddr(), 
                request.getHeader("User-Agent")
            );
        } catch (Exception e) {
            logger.error("Failed to log logout action for user {}: {}", userId, e.getMessage());
        }
    }

}
