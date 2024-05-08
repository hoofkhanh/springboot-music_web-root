package com.hokhanh.admin.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginController {

	@GetMapping("/login")
	public String login(Authentication authentication, Model model) {
		if(authentication != null) {
			return "redirect:/index";			
		}
		
		model.addAttribute("title", "Login Page");
		return "login";
	}
	
	@GetMapping("/index")
	public String index(Model model) {
		model.addAttribute("title", "Home Page");
		return "index";
	}
	
	
}
