package com.shopethethao.auth.security.user.entity;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopethethao.modules.account.Account;
import com.shopethethao.modules.account.Gender;

import lombok.Data;

@Data
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;
    private String id;
    private String phone;
    private String fullname;
    private String image;
    private String email;
    private String address;
    @JsonIgnore
    private String password;
    private Date birthday;
    private Gender gender; 
    private Date createdDate;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(String id, String phone, String fullname, String image, String email, String address,
            String password, Date birthday, Gender gender, Date createdDate,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.phone = phone;
        this.fullname = fullname;
        this.image = image;
        this.email = email;
        this.address = address;
        this.password = password;
        this.birthday = birthday;
        this.gender = gender;
        this.createdDate = createdDate;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Account account) {
        List<GrantedAuthority> authorities = account.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                account.getId(),
                account.getPhone(),
                account.getFullname(),
                account.getImage(),
                account.getEmail(),
                account.getAddress(),
                account.getPassword(),
                account.getBirthday(),
                account.getGender(),
                account.getCreatedDate(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getUsername() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
