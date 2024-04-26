package com.hokhanh.libary.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hokhanh.libary.model.OTP;

public interface OtpRepository extends JpaRepository<OTP, Long> {

	OTP findByEmailAndChucNang(String email, String chucNang);
}
