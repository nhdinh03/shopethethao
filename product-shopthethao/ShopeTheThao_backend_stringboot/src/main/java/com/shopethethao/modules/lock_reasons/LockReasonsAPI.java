package com.shopethethao.modules.lock_reasons;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.auth.payload.response.MessageResponse;
import com.shopethethao.dto.ResponseDTO;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;

@RestController
@RequestMapping("/api/lockreasons")
public class LockReasonsAPI {

    @Autowired
    private AccountDAO accountDao;

    @Autowired
    private LockReasonsDAO lockReasonRepository;
    

    @GetMapping
    public ResponseEntity<?> getLockedAccounts(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("search") Optional<String> search) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            
            Sort sort = Sort.by(Sort.Order.desc("createdDate"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            
            Page<Account> page;
            if (search.isPresent() && !search.get().trim().isEmpty()) {
                page = accountDao.searchLockedAccounts(search.get().trim(), pageable);
            } else {
                page = accountDao.findByStatus(0, pageable);
            }

            // Get all lock reasons
            List<LockReasons> lockReasons = lockReasonRepository.findAll();
            Map<String, String> accountLockReasons = new HashMap<>();
            for (LockReasons lockReason : lockReasons) {
                accountLockReasons.put(lockReason.getAccount().getId(), lockReason.getReason());
            }
            
            List<Map<String, Object>> result = new ArrayList<>();
            for (Account account : page.getContent()) {
                Map<String, Object> accountInfo = new HashMap<>();
                accountInfo.put("account", account);
                accountInfo.put("lockReason", accountLockReasons.get(account.getId()));
                result.add(accountInfo);
            }
            
            ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>();
            responseDTO.setData(result);
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }


    @PutMapping("/unlock/{accountId}")
    public ResponseEntity<?> unlockAccount(@PathVariable String accountId) {
        try {
            Optional<Account> accountOpt = accountDao.findById(accountId);
            if (!accountOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Tài khoản không tồn tại"));
            }

            Account account = accountOpt.get();
            account.setStatus(1); // Set to active
            accountDao.save(account);

            // Delete lock reasons
            lockReasonRepository.deleteByAccountId(accountId);

            return ResponseEntity.ok(new MessageResponse("Mở khóa tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi khi mở khóa tài khoản: " + e.getMessage()));
        }
    }
}
