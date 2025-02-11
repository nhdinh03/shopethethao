package com.shopethethao.modules.lock_reasons;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;

@Service
public class AccountService {

    @Autowired
    private AccountDAO accountDao;

    @Autowired
    private LockReasonsDAO lockReasonRepository;

    public void lockAccount(String accountId, String reason) {
        Optional<Account> accountOpt = accountDao.findById(accountId);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            account.setStatus(0); 
            accountDao.save(account);

            LockReasons lockReason = new LockReasons();
            lockReason.setAccount(account);
            lockReason.setReason(reason);
            lockReason.setCreatedAt(new Date());

            lockReasonRepository.save(lockReason);
        } else {
            throw new RuntimeException("Tài khoản không tồn tại");
        }
    }

}