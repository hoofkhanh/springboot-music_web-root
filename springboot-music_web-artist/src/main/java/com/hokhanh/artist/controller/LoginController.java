package com.hokhanh.artist.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.hokhanh.libary.model.Country;
import com.hokhanh.libary.model.Notification;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.CountryRepository;
import com.hokhanh.libary.repository.NotificationRepository;
import com.hokhanh.libary.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private CountryRepository countryRepository;
	
	@Autowired
	private NotificationRepository notificationRepository;


	@GetMapping("/login")
	public String loginPage(Model model, Authentication authentication) {
		if(authentication != null) {
			return "redirect:/index";
		}
		
		Notification notification = this.notificationRepository.findFirstNoti();
		if(notification != null) {
			model.addAttribute("notification", notification.getContent());
			this.notificationRepository.deleteAll();
		}
	
		return "login";	
	}

	@GetMapping("/register")
	public String registerPage(Model model, Authentication authentication, String  email, String password, String firstName,
				String lastName, String Otp, String artistName, LocalDate dayOfBirth, String gender, Country country, String notification) {
		if(authentication != null) {
			return "redirect:/index";
		}
		
		model.addAttribute("countryList", this.countryRepository.findAll());
		
		if(email != null) {
			model.addAttribute("email",  email);
			model.addAttribute("password", password);
			model.addAttribute("firstName", firstName);
			model.addAttribute("lastName", lastName);
			model.addAttribute("otp", Otp);
			model.addAttribute("artistName", artistName);
			model.addAttribute("dayOfBirth", dayOfBirth);
			model.addAttribute("gender", gender);
			model.addAttribute("idOfCountry", country.getId());
		}
		
		if(notification != null) {
			model.addAttribute("notification", notification);
		}
		
		return "register";
	}
	
	@GetMapping("/register/sendOtpToEmail")
	@ResponseBody
	public void sendOtpToEmailRegister(String email, Model model, Authentication authentication) throws UnsupportedEncodingException, MessagingException {
		this.userService.sendOTPEmail(email, "Đăng kí");
	}
	
	@PostMapping("/register/confirmRegister")
	public String confirmRegister(User user, String Otp, Model model, RedirectAttributes attributes) throws IOException  {
		String notification = this.userService.confirmRegister(user, Otp );
		if(notification.equals("Thành công") == false) {
			attributes.addAttribute("email", user.getEmail());
			attributes.addAttribute("password", user.getPassword());
			attributes.addAttribute("firstName", user.getFirstName());
			attributes.addAttribute("lastName", user.getLastName());
			attributes.addAttribute("artistName", user.getArtistName());
			attributes.addAttribute("dayOfBirth", user.getDayOfBirth());
			attributes.addAttribute("country", user.getCountry());
			attributes.addAttribute("gender", user.getGender());
			attributes.addAttribute("Otp", Otp);
		}
		
		attributes.addAttribute("notification", notification);
		return "redirect:/register";
	}
	
	@GetMapping("/forgetPassword")
	public String forgetPasswordPage(Model model, Authentication authentication, String email, String password, String Otp, String notification ) {
		if(authentication != null) {
			return "redirect:/index";
		}
		
		if(email != null) {
			model.addAttribute("email", email);
		}
		
		if(password != null) {
			model.addAttribute("password", password);
		}
		
		if(Otp != null) {
			model.addAttribute("otp", Otp);
		}
		
		if(notification != null) {
			model.addAttribute("notification", notification);
		}
		
		return "forget-password";
	}
	
	@GetMapping("/forgetPassword/sendOtpToEmail")
	@ResponseBody
	public void sendOtpToEmailForgetPassword(String email, Model model, Authentication authentication) throws UnsupportedEncodingException, MessagingException {
		this.userService.sendOTPEmail(email, "Quên mật khẩu");
	}
	
	@PostMapping("/forgetPassword/confirmForgetPassword")
	public String confirmForgetPassword(String email, String password, String Otp, Model model, RedirectAttributes attributes)  {
		String notification = this.userService.confirmForgetPassword(email, password,Otp );
		if(notification.equals("Thành công") == false) {
			attributes.addAttribute("email", email);
			attributes.addAttribute("password", password);
			attributes.addAttribute("Otp", Otp);
			
		}
		
		attributes.addAttribute("notification", notification);
		return "redirect:/forgetPassword";
	}
	
	@GetMapping("/changePassword")
	public String changePasswordPage(Model model, Authentication authentication, String email , String oldPassword, String newPassword, String notification) {
		if(authentication != null) {
			return "redirect:/index";
		}
		
		if(email != null) {
			model.addAttribute("email", email);
			model.addAttribute("oldPassword", oldPassword);
			model.addAttribute("newPassword", newPassword);
		}
		
		if(notification != null) {
			model.addAttribute("notification", notification);
		}
		
		return "change-pass";
	}
	
	@PostMapping("/changePassword/conductChange")
	public String conductChange(String email, String oldPassword, String newPassword, RedirectAttributes attributes)  {
		String notification = this.userService.conductChange(email, oldPassword, newPassword );
		if(notification.equals("Thành công") == false) {
			attributes.addAttribute("email", email);
			attributes.addAttribute("oldPassword", oldPassword);
			attributes.addAttribute("newPassword", newPassword);
		}
		
		attributes.addAttribute("notification", notification);
		return "redirect:/changePassword";
	}
	
	
}
