package com.shopethethao.auth.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  AccountDAO accountDAO;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
    Account account = accountDAO.findById(id)
        .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng có Id: " + id));

    return UserDetailsImpl.build(account);
  }

}
