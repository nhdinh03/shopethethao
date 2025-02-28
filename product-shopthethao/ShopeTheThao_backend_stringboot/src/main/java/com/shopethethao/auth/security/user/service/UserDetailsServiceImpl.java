package com.shopethethao.auth.security.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopethethao.auth.security.user.entity.UserDetailsImpl;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.AccountDAO;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  AccountDAO accountDAO;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Account account = accountDAO.findById(username)
        .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng có Id: " + username));

    return UserDetailsImpl.build(account);
  }

}
