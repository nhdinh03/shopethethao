package com.shopethethao.auth.controllers;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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

import com.shopethethao.auth.OTP.util.AccountValidationUtil;
import com.shopethethao.auth.OTP.util.EmailUtil;
import com.shopethethao.auth.OTP.util.OtpUtil;
import com.shopethethao.auth.models.SecurityAccount;
import com.shopethethao.auth.models.SecurityERole;
import com.shopethethao.auth.models.SecurityRole;
import com.shopethethao.auth.payload.request.ChangePasswordRequest;
import com.shopethethao.auth.payload.request.ForgotPassword;
import com.shopethethao.auth.payload.request.LoginRequest;
import com.shopethethao.auth.payload.request.NewOtp;
import com.shopethethao.auth.payload.request.SignupRequest;
import com.shopethethao.auth.payload.response.JwtResponseDTO;
import com.shopethethao.auth.payload.response.MessageResponse;
import com.shopethethao.auth.repository.AccountRepository;
import com.shopethethao.auth.repository.RoleRepository;
import com.shopethethao.auth.security.jwt.JwtUtils;
import com.shopethethao.auth.security.services.UserDetailsImpl;
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
    AccountRepository accountRepository;

    @Autowired
    RoleRepository roleRepository;

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

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        SecurityAccount securityAccount = accountRepository.findById(loginRequest.getId())
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với id: " + loginRequest.getId()));
        AccountValidationUtil.validateAccount(securityAccount, loginRequest.getPassword(), encoder);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getId(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        // Trả về JWT và thông tin người dùng
        return ResponseEntity.ok(new JwtResponseDTO(
                userDetails.getId(),
                userDetails.getPhone(),
                userDetails.getFullname(),
                userDetails.getEmail(),
                userDetails.getAddress(),
                userDetails.getBirthday(),
                userDetails.getGender(),
                userDetails.getImage(),
                jwt,
                "Bearer",
                roles));
    }

    @Transactional // Transactional OTP chỉ được lưu khi tất cả các thao tác thành công:
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        Map<Boolean, String> validationMap = new LinkedHashMap<>();
        validationMap.put(accountRepository.existsById(signUpRequest.getId()), "Tên người dùng đã tồn tại!");
        validationMap.put(accountRepository.existsByEmail(signUpRequest.getEmail()), "Email đã được sử dụng!");
        validationMap.put(accountRepository.existsByPhone(signUpRequest.getPhone()), "Số điện thoại đã được sử dụng!");
        for (Map.Entry<Boolean, String> entry : validationMap.entrySet()) {
            if (entry.getKey()) {
                return ResponseEntity.badRequest().body(new MessageResponse(entry.getValue()));
            }
        }
        // Tạo tài khoản mới
        SecurityAccount account = new SecurityAccount(
                signUpRequest.getId(),
                signUpRequest.getPhone(),
                signUpRequest.getFullname(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        account.setStatus(1);
        account.setCreatedDate(new Date());
        account.setVerified(false);
        Set<String> strRoles = signUpRequest.getRole();
        Set<SecurityRole> roles = new HashSet<>();
        if (strRoles == null) {
            SecurityRole userRole = roleRepository.findByName(SecurityERole.User)
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                SecurityRole securityRole = roleRepository.findByName(SecurityERole.valueOf(role))
                        .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò"));
                roles.add(securityRole);
            });
        }
        account.setRoles(roles);
        String otp = otpUtil.generateOtp();
        try {
            emailUtil.sendOtpEmail(signUpRequest.getEmail(), otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi OTP, vui lòng thử lại sau!");
        }
        // Tạo Verifications
        Verifications verifications = new Verifications();
        verifications.setAccountId(signUpRequest.getId());
        verifications.setCode(otp);
        verifications.setActive(false);
        verifications.setCreatedAt(LocalDateTime.now());
        verifications.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        verifications.setSecurityAccount(account);
        account.setVerification(verifications);
        accountRepository.save(account);
        return ResponseEntity
                .ok(new MessageResponse("Người dùng đã đăng ký thành công, vui lòng kiểm tra email để xác thực!"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        SecurityAccount securityAccount = accountRepository.findById(changePasswordRequest.getId())
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
        accountRepository.save(securityAccount);
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Đổi Mật khẩu thành công"));

    }

    @PostMapping("/verify-account")
    public ResponseEntity<?> verifyOtp(@RequestBody LoginRequest loginRequest) {
        SecurityAccount securityAccount = accountRepository.findById(loginRequest.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id này: " + loginRequest.getId()));
        List<Verifications> verifications = verificationDAO.findByAccountId(securityAccount.getId());
        boolean isOtpValid = false;
        for (Verifications verification : verifications) {
            if (verification.getCode().equals(loginRequest.getOtp())) {
                // Kiểm tra xem OTP có hết hạn hay không
                if (verification.getExpiresAt().isAfter(LocalDateTime.now())) {
                    verification.setActive(true);
                    verificationDAO.save(verification);
                    securityAccount.setVerified(true);
                    accountRepository.save(securityAccount);
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
        Optional<SecurityAccount> securityAccountOpt = accountRepository.findByEmail(email);

        if (!securityAccountOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Không tìm thấy người dùng với email này: " + email));
        }
        SecurityAccount securityAccount = securityAccountOpt.get();
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
    // Optional<SecurityAccount> existingAccountOpt =
    // accountRepository.findById(id);
    // if (!existingAccountOpt.isPresent()) {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản không được
    // tìm thấy");
    // }
    // SecurityAccount existingAccount = existingAccountOpt.get();
    // if (!existingAccount.getPhone().equals(userDto.getPhone()) &&
    // accountRepository.existsByPhone(userDto.getPhone())) {
    // return ResponseEntity
    // .badRequest()
    // .body(new MessageResponse("Số điện thoai đã được sử dụng!"));
    // }
    // if (!existingAccount.getEmail().equals(userDto.getEmail()) &&
    // accountRepository.existsByEmail(userDto.getEmail())) {
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
    // SecurityAccount updatedAccount = accountRepository.save(existingAccount);
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
        Optional<SecurityAccount> userOpt = accountRepository.findByEmail(newOtp.getEmail());
        if (!userOpt.isPresent()) {
            return ResponseEntity.ok(new MessageResponse("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi."));
        }
        SecurityAccount user = userOpt.get();
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không hợp lệ hoặc không tồn tại."));

        if (Duration.between(verification.getCreatedAt(), LocalDateTime.now()).getSeconds() > 1000) {
            verification.setActive(false);
            verificationDAO.save(verification);
            return ResponseEntity.badRequest().body(new MessageResponse("OTP đã hết hạn."));
        }

        SecurityAccount user = accountRepository.findById(verification.getAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));

        user.setPassword(encoder.encode(forgotPassword.getNewPassword()));
        accountRepository.save(user);

        // Hủy hiệu lực OTP
        verification.setActive(false);
        verificationDAO.save(verification);

        return ResponseEntity.ok(new MessageResponse("Mật khẩu đã được cập nhật thành công."));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("Đăng xuất thành công!"));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<SecurityAccount>> findAll() {
        List<SecurityAccount> accounts = accountRepository.findAll();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{email}")
    public ResponseEntity<SecurityAccount> findByEmail(@PathVariable String email) {
        Optional<SecurityAccount> optionalAccount = accountRepository.findByEmail(email);
        return optionalAccount.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
