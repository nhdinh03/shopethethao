package com.shopethethao.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {

	private String id;
	private String phone;
	private String fullname;
	private String email;
	private String address;
	private Date birthday;
	private Boolean gender;
	private String image;
	private Integer status;
	private Date createdDate;
	private Boolean verified;
	private int points;

}
