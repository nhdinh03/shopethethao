package com.shopethethao.auth.payload.auth.request;

import java.util.Set;

import com.shopethethao.modules.account.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @NotBlank
    private String id;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 50)
    private String fullname;

    private Set<String> role;

    @NotBlank
    @Size(min = 8, max = 40)
    private String password;

    private Gender gender; 

    @NotBlank
    @Size(min = 10, max = 15)
    private String phone;


    
}
