package com.shopethethao.modules.account;

import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.shopethethao.modules.account.Account;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountAPI {

    @Autowired
    private AccountDAO accountDao;


      @GetMapping("/getAll")
    public ResponseEntity<List<Account>> findAll() {
        List<Account> accounts = accountDao.findAll();
        return ResponseEntity.ok(accounts);
    }

    // @GetMapping
    // public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
    //         @RequestParam("limit") Optional<Integer> limit,
    //         @RequestParam("search") Optional<String> search,
    //         @RequestParam("status") Optional<Integer> status) {
    //     try {

    //         if (pageNo.isPresent() && pageNo.get() == 0) {
    //             return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
    //         }
    //         Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10));
    //         Page<AccountDTO> page = accountDao.getAllRoleUserAndActive(pageable, status.orElse(AccountStatus.ACTIVE),
    //                 search.orElse(""));

    //         ResponseDTO<AccountDTO> responseDTO = new ResponseDTO<>();
    //         responseDTO.setData(page.getContent());
    //         responseDTO.setTotalItems(page.getTotalElements());
    //         responseDTO.setTotalPages(page.getTotalPages());
    //         return ResponseEntity.ok(responseDTO);
    //     } catch (Exception e) {
    //         return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") String id) {
        try {
            if (!accountDao.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy người dùng",
                        HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(accountDao.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") String id,
            @RequestBody Account account) {
        try {
            if (!accountDao.existsById(id)) {
                return new ResponseEntity<>("Người dùng không tồn tại",
                        HttpStatus.NOT_FOUND);
            }
            accountDao.save(account);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Xóa tài khoản
    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable String id) {
        accountDao.deleteById(id);
    }
}
