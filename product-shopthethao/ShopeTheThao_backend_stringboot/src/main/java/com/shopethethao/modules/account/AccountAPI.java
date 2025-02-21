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
import com.shopethethao.modules.lock_reasons.LockReasons;
import com.shopethethao.modules.lock_reasons.LockReasonsDAO;
import com.shopethethao.modules.role.Role;
import com.shopethethao.modules.role.RoleDAO;
import com.shopethethao.modules.role.ERole;
import com.shopethethao.modules.userHistory.UserHistoryService;
import com.shopethethao.modules.userHistory.UserActionType;
import com.shopethethao.modules.verification.Verifications;
import com.shopethethao.modules.verification.VerificationsDAO;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/accounts")
public class AccountAPI {

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
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam(value = "role", defaultValue = "USER") String roleName) {
        try {
            int page = pageNo.orElse(1);
            int pageSize = limit.orElse(10);
            ERole roleEnum = ERole.fromString(roleName);           
            Role role = roleDAO.findByName(roleEnum)
                    .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " không tìm thấy"));
            Sort sort = Sort.by(
                Sort.Order.desc("createdDate"),
                Sort.Order.desc("id")
            );   
            Pageable pageable = PageRequest.of(page - 1, pageSize, sort);
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

    @Transactional
    @PostMapping
    public ResponseEntity<?> registerUser(@Valid @RequestBody AccountsUserDto accountsUser, HttpServletRequest request) {
        try {
            boolean exists = accountDao.existsById(accountsUser.getId())
                    || accountDao.existsByEmail(accountsUser.getEmail())
                    || accountDao.existsByPhone(accountsUser.getPhone());

            if (exists) {
                return ResponseEntity.badRequest().body(new MessageResponse("Tài khoản hoặc thông tin đã tồn tại!"));
            }
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
            account.setVerified(true); 
            account.setAddress(accountsUser.getAddress());
            Set<String> strRoles = accountsUser.getRole();
            Set<Role> roles = new HashSet<>();
            if (strRoles == null || strRoles.isEmpty()) {
                Role userRole = roleDAO.findByName(ERole.USER)
                        .orElseThrow(() -> new IllegalArgumentException("Lỗi: Không tìm thấy vai trò USER"));
                roles.add(userRole); 
            } else {
                for (String role : strRoles) {
                    try {
                        // Chuyển đổi từ String role sang SecurityERole enum
                        ERole roleEnum = ERole.fromString(role);
                        Role roleFromDB = roleDAO.findByName(roleEnum)
                                .orElseThrow(
                                        () -> new IllegalArgumentException("Lỗi: Không tìm thấy vai trò - " + role));
                        roles.add(roleFromDB);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: " + e.getMessage()));
                    }
                }
            }
            account.setRoles(roles);
            account = accountDao.save(account);
            // Lưu thông tin xác thực cho tài khoản vừa tạo
            account.setImage(accountsUser.getImage());
            Verifications verifications = new Verifications();
            verifications.setAccount(account); 
            verifications.setCode("ADMIN-VERIFIED");
            verifications.setActive(true);
            verifications.setCreatedAt(LocalDateTime.now());
            verifications.setExpiresAt(LocalDateTime.now().plusYears(10));
            verificationDAO.save(verifications);
            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.CREATE_ACCOUNT,
                    "Tạo mới tài khoản: " + account.getId(),
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent"));
            }
            return ResponseEntity.ok(new MessageResponse("Người dùng đã đăng ký thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable("id") String id, @RequestBody Account updatedAccount, HttpServletRequest request) {
        try {
            Optional<Account> existingAccount = accountDao.findById(id);
            if (existingAccount.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Người dùng không tồn tại"));
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
            account.setStatus(updatedAccount.getStatus()); 
            account.setVerified(updatedAccount.getVerified());
            account.setPoints(updatedAccount.getPoints());
            if (updatedAccount.getPassword() != null && !updatedAccount.getPassword().isEmpty()) {
                account.setPassword(encoder.encode(updatedAccount.getPassword()));
            }
            // Lưu lại thay đổi
            accountDao.save(account);
            if (updatedAccount.getStatus() == 0) {
                List<LockReasons> lockReasons = updatedAccount.getLockReasons();
                if (lockReasons != null && !lockReasons.isEmpty()) {
                    String lockReason = lockReasons.get(0).getReason(); 

                    LockReasons lockReasonEntry = new LockReasons();
                    lockReasonEntry.setAccount(account); 
                    lockReasonEntry.setReason(lockReason);
                    lockReasonEntry.setCreatedAt(new Date());

                    lockReasonsDAO.save(lockReasonEntry); // Lưu lý do khóa
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new MessageResponse("Lý do khóa không có trong danh sách!"));
                }
            }

            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.UPDATE_ACCOUNT,
                    "Cập nhật tài khoản: " + id,
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent"));
            }

            return ResponseEntity.ok(new MessageResponse("Cập nhật tài khoản thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccountById(@PathVariable String id, HttpServletRequest request) {
        try {
            Optional<Account> account = accountDao.findById(id);
            if (account.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tài khoản không tồn tại.");
            }

            // Xoá tài khoản và LockReasons liên quan
            Account existingAccount = account.get();
            existingAccount.getLockReasons().clear(); 

            accountService.deleteAccount(id); 

            String userId = getCurrentUserId();
            if (userId != null) {
                userHistoryService.logUserAction(
                    userId,
                    UserActionType.DELETE_ACCOUNT,
                    "Xóa tài khoản: " + id,
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent"));
            }

            return ResponseEntity.ok("Tài khoản và vai trò đã được xóa thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống, vui lòng thử lại sau.");
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
