package com.shopethethao.auth.security.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopethethao.auth.models.SecurityAccount;
import com.shopethethao.auth.repository.AccountRepository;







@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  AccountRepository dao;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
    SecurityAccount account = dao.findById(id)
        .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng có Id: " + id));

    return UserDetailsImpl.build(account);
  }

}
