package com.shopethethao.modules.accountStaff;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.ArrayList;
import java.util.Objects;

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
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.verification.Verifications;
import com.shopethethao.modules.verification.VerificationsDAO;
import com.shopethethao.service.UserHistoryService;

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
    public ResponseEntity<?> registerUser(@Valid @RequestBody AccountsUserDto accountsUser,
            HttpServletRequest request) {
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

            // Create detailed log message
            StringBuilder rolesStr = new StringBuilder();
            account.getRoles().forEach(role -> rolesStr.append("\n  - ").append(role.getName()));

            String logMessage = String.format("""
                    ADMIN: %s đã tạo Nhân viên mới
                    Chi tiết:
                    - ID: %s
                    - Họ tên: %s
                    - Email: %s
                    - Số điện thoại: %s
                    - Vai trò: %s
                    - Trạng thái: %s
                    - Địa chỉ: %s""",
                    getCurrentUserId(),
                    account.getId(),
                    account.getFullname(),
                    account.getEmail(),
                    account.getPhone(),
                    rolesStr.toString(),
                    account.getStatus() == 1 ? "Hoạt động" : "Khóa",
                    account.getAddress() != null ? account.getAddress() : "Chưa cập nhật");

            // Log the action
            userHistoryService.logUserAction(
                    getCurrentUserId(),
                    UserActionType.CREATE_ACCOUNTSTAFF,
                    logMessage,
                    getClientIp(request),
                    getClientInfo(request));

            return ResponseEntity.ok(new MessageResponse("Nhân viên đã được thêm thành công!"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống khi thêm nhân viên: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable("id") String id, @RequestBody Account updatedAccount,
            HttpServletRequest request) {
        try {
            Optional<Account> existingAccountOpt = accountDao.findById(id);
            if (existingAccountOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Không tìm thấy thông tin nhân viên"));
            }

            Account account = existingAccountOpt.get();
            // Track all changes
            List<String> changes = new ArrayList<>();

            // Check and record changes
            if (!Objects.equals(account.getFullname(), updatedAccount.getFullname())) {
                changes.add(String.format("- Họ tên: '%s' -> '%s'", 
                    account.getFullname(), updatedAccount.getFullname()));
                account.setFullname(updatedAccount.getFullname());
            }
            if (!Objects.equals(account.getPhone(), updatedAccount.getPhone())) {
                changes.add(String.format("- Số điện thoại: '%s' -> '%s'", 
                    account.getPhone(), updatedAccount.getPhone()));
                account.setPhone(updatedAccount.getPhone());
            }
            if (!Objects.equals(account.getEmail(), updatedAccount.getEmail())) {
                changes.add(String.format("- Email: '%s' -> '%s'", 
                    account.getEmail(), updatedAccount.getEmail()));
                account.setEmail(updatedAccount.getEmail());
            }
            if (!Objects.equals(account.getStatus(), updatedAccount.getStatus())) {
                changes.add(String.format("- Trạng thái: '%s' -> '%s'", 
                    account.getStatus() == 1 ? "Hoạt động" : "Khóa",
                    updatedAccount.getStatus() == 1 ? "Hoạt động" : "Khóa"));
                account.setStatus(updatedAccount.getStatus());
            }
            if (!Objects.equals(account.getAddress(), updatedAccount.getAddress())) {
                changes.add(String.format("- Địa chỉ: '%s' -> '%s'",
                    account.getAddress() != null ? account.getAddress() : "Chưa cập nhật",
                    updatedAccount.getAddress() != null ? updatedAccount.getAddress() : "Chưa cập nhật"));
                account.setAddress(updatedAccount.getAddress());
            }
            if (!Objects.equals(account.getGender(), updatedAccount.getGender())) {
                changes.add(String.format("- Giới tính: '%s' -> '%s'",
                    account.getGender() != null ? account.getGender() : "Chưa cập nhật",
                    updatedAccount.getGender() != null ? updatedAccount.getGender() : "Chưa cập nhật"));
                account.setGender(updatedAccount.getGender());
            }

            // Update other fields that don't need change tracking
            account.setBirthday(updatedAccount.getBirthday());
            account.setImage(updatedAccount.getImage());
            account.setVerified(updatedAccount.getVerified());

            if (updatedAccount.getPassword() != null && !updatedAccount.getPassword().isEmpty()) {
                account.setPassword(encoder.encode(updatedAccount.getPassword()));
                changes.add("- Mật khẩu: Đã được cập nhật");
            }

            // Save changes
            accountDao.save(account);

            // Handle lock reasons if account is locked
            if (updatedAccount.getStatus() == 0) {
                List<LockReasons> lockReasons = updatedAccount.getLockReasons();
                if (lockReasons != null && !lockReasons.isEmpty()) {
                    String lockReason = lockReasons.get(0).getReason();
                    LockReasons lockReasonEntry = new LockReasons();
                    lockReasonEntry.setAccount(account);
                    lockReasonEntry.setReason(lockReason);
                    lockReasonEntry.setCreatedAt(new Date());
                    lockReasonsDAO.save(lockReasonEntry);
                    changes.add(String.format("- Lý do khóa: %s", lockReason));
                }
            }

            // Create single detailed log message
            String logMessage = String.format("""
                    ADMIN: %s đã cập nhật thông tin nhân viên #%s
                    Chi tiết thay đổi:
                    %s""",
                    getCurrentUserId(),
                    id,
                    changes.isEmpty() ? "Không có thay đổi" : String.join("\n", changes));

            // Log the action once
            userHistoryService.logUserAction(
                getCurrentUserId(),
                UserActionType.UPDATE_ACCOUNTSTAFF,
                logMessage,
                getClientIp(request),
                getClientInfo(request)
            );

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
             String logMessage = String.format("""
                ADMIN: %s đã xóa tài khoản nhân viên
                Chi tiết tài khoản đã xóa:
                - ID: %s
                - Họ tên: %s
                - Email: %s
                - Số điện thoại: %s""",
                getCurrentUserId(),
                existingAccount.getId(),
                existingAccount.getFullname(),
                existingAccount.getEmail(),
                existingAccount.getPhone()
        );

        // Log the action
        userHistoryService.logUserAction(
            getCurrentUserId(),
            UserActionType.DELETE_ACCOUNTSTAFF,
            logMessage,
            getClientIp(request),
            getClientInfo(request)
        );


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

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private String getClientInfo(HttpServletRequest request) {
        return request.getHeader("User-Agent");
    }
}
