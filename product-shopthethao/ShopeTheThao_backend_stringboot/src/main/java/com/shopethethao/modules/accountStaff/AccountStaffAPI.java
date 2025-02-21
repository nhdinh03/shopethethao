package com.shopethethao.modules.accountStaff;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

import com.shopethethao.auth.payload.response.MessageResponse;
import com.shopethethao.dto.AccountServiceDTO;
import com.shopethethao.dto.AccountsUserDto;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;
import com.shopethethao.modules.lock_reasons.LockReasons;
import com.shopethethao.modules.lock_reasons.LockReasonsDAO;
import com.shopethethao.modules.role.Role;
import com.shopethethao.modules.role.RoleDAO;
import com.shopethethao.modules.role.ERole;
import com.shopethethao.modules.userHistory.UserHistoryService;
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.verification.Verifications;
import com.shopethethao.modules.verification.VerificationsDAO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accountStaff")
public class AccountStaffAPI {

    @Autowired
    private AccountDAO accountDao;

    @Autowired
    private AccountServiceDTO accountService;

    @Autowired
    private LockReasonsDAO lockReasonsDAO;

    @Autowired
    private VerificationsDAO verificationDAO;

    @Autowired
    private RoleDAO roleDAO;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserHistoryService userHistoryService;

    // ✅ Lấy danh sách tài khoản có phân trang
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam(value = "role", defaultValue = "STAFF") String roleName) {
        try {
            int page = pageNo.orElse(1);
            int pageSize = limit.orElse(10);

            // Convert role name to SecurityERole
            ERole roleEnum;
            try {
                roleEnum = ERole.fromString(roleName);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Invalid role name: " + roleName));
            }

            // Get the role
            Role role = roleDAO.findByName(roleEnum)
                    .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found"));

            // Sort by multiple fields in descending order
            Sort sort = Sort.by(
                    Sort.Order.desc("createdDate"),
                    Sort.Order.desc("id"));

            Pageable pageable = PageRequest.of(page - 1, pageSize, sort);

            // Find accounts with specified role
            Page<Account> accountPage = accountDao.findByRoles(role, pageable);
            List<Account> accounts = accountPage.getContent();
            long totalItems = accountPage.getTotalElements();

            ResponseDTO<Account> responseDTO = new ResponseDTO<>();
            responseDTO.setData(accounts);
            responseDTO.setTotalItems(totalItems);
            responseDTO.setTotalPages(accountPage.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    // ✅ Lấy tài khoản theo ID
    @Transactional
    @PostMapping
    public ResponseEntity<?> registerUser(@Valid @RequestBody AccountsUserDto accountsUser, HttpServletRequest request) {
        try {
            // ✅ Kiểm tra xem ID, Email, hoặc Phone có bị trùng không
            boolean exists = accountDao.existsById(accountsUser.getId())
                    || accountDao.existsByEmail(accountsUser.getEmail())
                    || accountDao.existsByPhone(accountsUser.getPhone());

            if (exists) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Thông tin nhân viên đã tồn tại trong hệ thống!"));
            }

            // ✅ Tạo tài khoản mới
            Account account = new Account(
                    accountsUser.getId(),
                    accountsUser.getPhone(),
                    accountsUser.getFullname(),
                    accountsUser.getEmail(),
                    encoder.encode(accountsUser.getPassword())); // Mã hóa mật khẩu

            account.setGender(accountsUser.getGender());
            account.setStatus(1);
            account.setCreatedDate(new Date());

            // Handle birthday
            if (accountsUser.getBirthday() != null) {
                LocalDate localDate = accountsUser.getBirthday();
                Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                account.setBirthday(date);
            } else {
                account.setBirthday(null);
            }

            account.setVerified(true); // Tự xác thực vì tạo từ admin
            account.setAddress(accountsUser.getAddress());

            // ✅ Xử lý vai trò (ROLE)
            Set<String> strRoles = accountsUser.getRole();
            Set<Role> roles = new HashSet<>();

            // Nếu không có vai trò nào, gán vai trò mặc định là "STAFF"
            if (strRoles == null || strRoles.isEmpty()) {
                Role staffRole = roleDAO.findByName(ERole.STAFF)
                        .orElseThrow(() -> new IllegalArgumentException("Lỗi: Không tìm thấy vai trò STAFF"));
                roles.add(staffRole);
            } else {
                // Nếu có vai trò, duyệt qua danh sách và gán vai trò
                for (String role : strRoles) {
                    try {
                        // Chuyển đổi từ String role sang SecurityERole enum
                        ERole roleEnum = ERole.fromString(role); // Chuyển đổi role string sang enum
                        Role roleFromDB = roleDAO.findByName(roleEnum)
                                .orElseThrow(
                                        () -> new IllegalArgumentException("Lỗi: Không tìm thấy vai trò - " + role));
                        roles.add(roleFromDB);
                    } catch (IllegalArgumentException e) {
                        // Nếu không tìm thấy vai trò, trả về lỗi
                        return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: " + e.getMessage()));
                    }
                }
            }

            // Gán vai trò cho tài khoản
            account.setRoles(roles);

            // **✅ LƯU ACCOUNT VÀO DB**
            account = accountDao.save(account);

            // Lưu thông tin xác thực cho tài khoản vừa tạo
            account.setImage(accountsUser.getImage());
            Verifications verifications = new Verifications();
            verifications.setAccount(account); // Thiết lập đối tượng `Account`
            verifications.setCode("ADMIN-VERIFIED");
            verifications.setActive(true);
            verifications.setCreatedAt(LocalDateTime.now());
            verifications.setExpiresAt(LocalDateTime.now().plusYears(10));

            verificationDAO.save(verifications);

            // Log the staff account creation
            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.CREATE_ACCOUNTSTAFF,
                    "Tạo mới tài khoản nhân viên: " + account.getId(),
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent"));
            }

            return ResponseEntity.ok(new MessageResponse("Nhân viên đã được thêm thành công!"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống khi thêm nhân viên: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable("id") String id, @RequestBody Account updatedAccount, HttpServletRequest request) {
        try {
            // Kiểm tra tài khoản tồn tại
            Optional<Account> existingAccount = accountDao.findById(id);
            if (existingAccount.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Không tìm thấy thông tin nhân viên"));
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
            account.setStatus(updatedAccount.getStatus()); // Cập nhật trạng thái
            account.setVerified(updatedAccount.getVerified());
            account.setPoints(updatedAccount.getPoints());

            // Nếu có mật khẩu mới, mã hóa lại mật khẩu
            if (updatedAccount.getPassword() != null && !updatedAccount.getPassword().isEmpty()) {
                account.setPassword(encoder.encode(updatedAccount.getPassword()));
            }

            // Lưu lại thay đổi
            accountDao.save(account);

            // Nếu trạng thái là khóa (status = 0), lưu lý do khóa
            if (updatedAccount.getStatus() == 0) {
                // Lấy danh sách lý do khóa
                List<LockReasons> lockReasons = updatedAccount.getLockReasons();

                if (lockReasons != null && !lockReasons.isEmpty()) {
                    // Lấy lý do khóa từ phần tử đầu tiên (nếu có)
                    String lockReason = lockReasons.get(0).getReason(); // Giả sử mỗi LockReasons có trường 'reason'

                    LockReasons lockReasonEntry = new LockReasons();
                    lockReasonEntry.setAccount(account); // Gán tài khoản
                    lockReasonEntry.setReason(lockReason); // Lý do khóa
                    lockReasonEntry.setCreatedAt(new Date());

                    lockReasonsDAO.save(lockReasonEntry); // Lưu lý do khóa
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new MessageResponse("Lý do khóa không có trong danh sách!"));
                }
            }

            // Log the staff account update
            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.UPDATE_ACCOUNTSTAFF,
                    "Cập nhật tài khoản nhân viên: " + id,
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent"));
            }

            return ResponseEntity.ok(new MessageResponse("Cập nhật thông tin nhân viên thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống khi cập nhật thông tin nhân viên: " + e.getMessage()));
        }
    }

    // ✅ Xóa tài khoản và LockReasons liên quan
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccountById(@PathVariable String id, HttpServletRequest request) {
        try {
            Optional<Account> account = accountDao.findById(id);
            if (account.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy thông tin nhân viên.");
            }

            // Xoá tài khoản và LockReasons liên quan
            Account existingAccount = account.get();
            // CascadeType.ALL ensures that LockReasons will be deleted as well
            existingAccount.getLockReasons().clear(); // Clear the associated lock reasons if needed (optional)

            accountService.deleteAccount(id); // Call deleteAccount method from AccountService

            // Log the staff account deletion
            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.DELETE_ACCOUNTSTAFF,
                    "Xóa tài khoản nhân viên: " + id,
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent"));
            }

            return ResponseEntity.ok("Đã xóa thông tin nhân viên thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống khi xóa thông tin nhân viên, vui lòng thử lại sau.");
        }
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }
}
