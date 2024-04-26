package com.hokhanh.libary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.UserRepository;

@Service
public class AdminService {
	
	@Autowired
	private UserRepository userRepository;
	
	public User findAdminByEmail(String email) {
		User admin = this.userRepository.findByEmail(email);
		if(admin != null && admin.getRole().getName().equals("ADMIN")) {
			return admin;	
		}else {
			return null;
		}
		
	}
	
	public User findUserAndAdminByEmail(String email) {
		return this.userRepository.findByEmail(email);	
	}
	

}
