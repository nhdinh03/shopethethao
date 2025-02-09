package com.shopethethao.modules.account;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.auth.OTP.util.EmailUtil;
import com.shopethethao.auth.OTP.util.OtpUtil;
import com.shopethethao.auth.models.SecurityERole;
import com.shopethethao.auth.models.SecurityRole;
import com.shopethethao.auth.payload.request.AccountsUser;
import com.shopethethao.auth.payload.response.MessageResponse;
import com.shopethethao.auth.repository.RoleRepository;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.verification.Verifications;
import com.shopethethao.modules.verification.VerificationsDAO;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
public class AccountAPI {

    @Autowired
    private AccountDAO accountDao;

    @Autowired
    private VerificationsDAO verificationDAO;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private OtpUtil otpUtil;

    @Autowired
    private EmailUtil emailUtil;

    // ✅ Lấy tất cả tài khoản
    @GetMapping("/get/all")
    public ResponseEntity<List<Account>> findAll() {
        List<Account> accounts = accountDao.findAll();
        return ResponseEntity.ok(accounts);
    }

    // ✅ Lấy danh sách tài khoản có phân trang
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            int page = pageNo.orElse(1);
            int pageSize = limit.orElse(10);

            if (page <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Trang không hợp lệ");
            }

            int offset = (page - 1) * pageSize;
            List<Account> accounts = accountDao.findAllUsersWithPagination(offset, pageSize);
            long totalItems = accountDao.countAllUsers();

            ResponseDTO<Account> responseDTO = new ResponseDTO<>();
            responseDTO.setData(accounts);
            responseDTO.setTotalItems(totalItems);
            responseDTO.setTotalPages((int) Math.ceil((double) totalItems / pageSize));

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error, vui lòng thử lại sau!");
        }
    }

    // ✅ Lấy tài khoản theo ID
    @Transactional
    @PostMapping
    public ResponseEntity<?> registerUser(@Valid @RequestBody AccountsUser accountsUser) {
        try {
            // ✅ Kiểm tra xem ID, Email, hoặc Phone có bị trùng không
            boolean exists = accountDao.existsById(accountsUser.getId())
                    || accountDao.existsByEmail(accountsUser.getEmail())
                    || accountDao.existsByPhone(accountsUser.getPhone());

            if (exists) {
                return ResponseEntity.badRequest().body(new MessageResponse("Tài khoản hoặc thông tin đã tồn tại!"));
            }

            // ✅ Tạo tài khoản mới
            Account account = new Account(
                    accountsUser.getId(),
                    accountsUser.getPhone(),
                    accountsUser.getFullname(),
                    accountsUser.getEmail(),
                    encoder.encode(accountsUser.getPassword()));

            account.setGender(accountsUser.getGender());
            account.setStatus(1);
            account.setCreatedDate(new Date());
            if (accountsUser.getBirthday() != null) {
                LocalDate localDate = accountsUser.getBirthday();
                Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                account.setBirthday(date);
            } else {
                account.setBirthday(null);
            }

            account.setVerified(true); // Tự xác thực vì tạo từ admin
            // account.setPoints(accountsUser.getPoints());
            account.setAddress(accountsUser.getAddress());

            // ✅ Xử lý vai trò (ROLE)
            Set<String> strRoles = accountsUser.getRole();
            Set<SecurityRole> roles = new HashSet<>();

            if (strRoles == null || strRoles.isEmpty()) {
                SecurityRole userRole = roleRepository.findByName(SecurityERole.USER)
                        .orElseThrow(() -> new IllegalArgumentException("Lỗi: Không tìm thấy vai trò USER"));
                roles.add(userRole);

            } else {
                for (String role : strRoles) {
                    SecurityERole roleEnum = SecurityERole.fromString(role);
                    SecurityRole securityRole = roleRepository.findByName(roleEnum)
                            .orElseThrow(() -> new IllegalArgumentException("Lỗi: Không tìm thấy vai trò - " + role));
                    roles.add(securityRole);
                }
            }
            account.setRoles(roles);

            // **✅ LƯU ACCOUNT VÀO DB TRƯỚC**
            account = accountDao.save(account);
            account.setImage(accountsUser.getImage());
            Verifications verifications = new Verifications();
            verifications.setAccount(account); // ✅ Thiết lập đối tượng `Account`
            verifications.setCode("ADMIN-VERIFIED");
            verifications.setActive(true);
            verifications.setCreatedAt(LocalDateTime.now());
            verifications.setExpiresAt(LocalDateTime.now().plusYears(10));

            verificationDAO.save(verifications);

            return ResponseEntity.ok(new MessageResponse("Người dùng đã đăng ký thành công!"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // ✅ Thêm mới tài khoản
    // @PostMapping
    // public ResponseEntity<?> createAccount(@RequestBody Account account) {
    // try {
    // if (accountDao.existsById(account.getId())) {
    // return ResponseEntity.status(HttpStatus.CONFLICT)
    // .body("Tài khoản đã tồn tại");
    // }
    // Account savedAccount = accountDao.save(account);
    // return ResponseEntity.status(HttpStatus.CREATED).body(savedAccount);
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    // .body("Server error, vui lòng thử lại sau!");
    // }
    // }

    // ✅ Cập nhật tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable("id") String id,
            @RequestBody Account updatedAccount) {
        try {
            Optional<Account> existingAccount = accountDao.findById(id);
            if (existingAccount.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Người dùng không tồn tại");
            }

            // Cập nhật thông tin tài khoản
            Account account = existingAccount.get();
            account.setFullname(updatedAccount.getFullname());
            account.setPhone(updatedAccount.getPhone());
            account.setEmail(updatedAccount.getEmail());
            account.setAddress(updatedAccount.getAddress());
            account.setBirthday(updatedAccount.getBirthday());
            account.setGender(updatedAccount.getGender());
            account.setImage(updatedAccount.getImage());
            account.setVerified(updatedAccount.getVerified());
            account.setPoints(updatedAccount.getPoints());

            accountDao.save(account);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error, vui lòng thử lại sau!");
        }
    }

    // ✅ Xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id) {
        try {
            if (!accountDao.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tài khoản không tồn tại");
            }
            accountDao.deleteById(id);
            return ResponseEntity.ok("Xóa tài khoản thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error, vui lòng thử lại sau!");
        }
    }

}
