package com.hokhanh.libary.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OTP {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name =  "otp_id")
	private Long id;
	
	private String otp;
	private String email;
	

	private LocalDateTime expireTime;
	
	private String chucNang;
}
