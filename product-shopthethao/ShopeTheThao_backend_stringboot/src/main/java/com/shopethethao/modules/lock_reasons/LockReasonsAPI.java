package com.shopethethao.modules.lock_reasons;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.auth.payload.response.MessageResponse;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;

@RestController
@RequestMapping("/api/lockreasons")
public class LockReasonsAPI {

    @Autowired
    private AccountDAO accountDao;

    @Autowired
    private LockReasonsDAO lockReasonRepository;

    @GetMapping("/get/all")
    public ResponseEntity<?> getLockedAccounts() {
        try {
  // (status = 0)
            List<Account> lockedAccounts = accountDao.findByStatus(0);
            List<LockReasons> lockReasons = lockReasonRepository.findAll();
            Map<String, String> accountLockReasons = new HashMap<>();
            for (LockReasons lockReason : lockReasons) {

                accountLockReasons.put(lockReason.getAccount().getId(), lockReason.getReason());
            }

            List<Map<String, Object>> result = new ArrayList<>();
            for (Account account : lockedAccounts) {
                Map<String, Object> accountInfo = new HashMap<>();
                accountInfo.put("account", account);
                accountInfo.put("lockReason", accountLockReasons.get(account.getId()));
                result.add(accountInfo);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable("id") Integer id) {
        Optional<LockReasons> existingBrand = lockReasonRepository.findById(id);
        if (existingBrand.isPresent()) {
            lockReasonRepository.deleteById(id);
            return ResponseEntity.ok("Xóa thương hiệu thành công!");
        } else {
            return new ResponseEntity<>("Thương hiệu không tồn tại!", HttpStatus.NOT_FOUND);
        }
    }
}
