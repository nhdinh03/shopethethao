package com.shopethethao.auth.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
	@NotBlank
	private String id;

	@NotBlank
	private String password;

	private String otp;

}
