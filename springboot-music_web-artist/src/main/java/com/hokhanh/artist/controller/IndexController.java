package com.hokhanh.artist.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.hokhanh.libary.model.User;
import com.hokhanh.libary.service.AdminService;
import com.hokhanh.libary.service.GenreService;
import com.hokhanh.libary.service.TrackService;
import com.hokhanh.libary.service.UserService;

@Controller
public class IndexController {
	
	@Autowired
	private GenreService genreService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private AdminService adminService;
	 
	
	@GetMapping(value = {"/index"})
	public String indexPage(Model model, Authentication authentication) {
		model.addAttribute("title", "Trang chủ");
		model.addAttribute("genreList", this.genreService.findAllGenre());
		model.addAttribute("followingList", this.userService.findAllFollowEachOtherList(authentication));
		model.addAttribute("artistName", this.adminService.findUserAndAdminByEmail(authentication.getName()).getArtistName());
		
		User user = this.userService.findUserByEmail(authentication.getName());
		model.addAttribute("roleOfArtist", user.getRole().getName());
		return "index";	
	}
}
