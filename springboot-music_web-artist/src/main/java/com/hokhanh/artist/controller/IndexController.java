package com.hokhanh.artist.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JOptionPane;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.hokhanh.libary.model.Notification;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.NotificationRepository;
import com.hokhanh.libary.service.AdminService;
import com.hokhanh.libary.service.GenreService;
import com.hokhanh.libary.service.TrackService;
import com.hokhanh.libary.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class IndexController {

	@Autowired
	private GenreService genreService;

	@Autowired
	private UserService userService;

	@Autowired
	private AdminService adminService;
	
	@Autowired
	private NotificationRepository notificationRepository;
	


	@GetMapping(value = { "/index" })
	public String indexPage(Model model, Authentication authentication) {
		model.addAttribute("title", "Trang chủ");
		model.addAttribute("genreList", this.genreService.findAllGenre());
		model.addAttribute("followingList", this.userService.findAllFollowEachOtherList(authentication.getName()));
		model.addAttribute("artistName", this.adminService.findUserAndAdminByEmail(authentication.getName()).getArtistName());
		
		User user = this.userService.findUserByEmail(authentication.getName());
		model.addAttribute("roleOfArtist", user.getRole().getName());
		return "index";
	}

	@GetMapping("/login-google")
	public String loginGoogle(@AuthenticationPrincipal OAuth2User auth2User, RedirectAttributes redirectAttributes) throws UnsupportedEncodingException {
		String email = (String) auth2User.getAttributes().get("email");

		String role = this.userService.findByEmailForAllRole(email);
		if (role != null && role.equals("ADMIN")) {
			this.notificationRepository.deleteAll();
			
			Notification notification = new Notification();
			notification.setContent("Tài khoản này không thể đăng nhập");
			this.notificationRepository.save(notification);
			return "redirect:/logout";
		} else if (role != null && role.equals("ARTIST")) {
			User artist = this.userService.findUserByEmail(email);

			List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
			grantedAuthorities.add(new SimpleGrantedAuthority(artist.getRole().getName()));
			
			Authentication updatedAuthentication = new UsernamePasswordAuthenticationToken(artist.getEmail(), artist.getPassword(),
					grantedAuthorities);
			
			 SecurityContextHolder.getContext().setAuthentication(updatedAuthentication);
			
			return "redirect:/index";
		} else {
			this.notificationRepository.deleteAll();
			
			Notification notification = new Notification();
			notification.setContent("Vui lòng đăng kí bằng tài khoản google trước đó để có thể liên kết");
			this.notificationRepository.save(notification);
			return "redirect:/logout";
		}
	}



}
