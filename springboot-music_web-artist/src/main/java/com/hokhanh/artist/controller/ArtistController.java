package com.hokhanh.artist.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.CountryRepository;
import com.hokhanh.libary.repository.UserRepository;
import com.hokhanh.libary.service.UserService;


@Controller
public class ArtistController {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserService userService;
	
	@Autowired
	private CountryRepository countryRepository;

	@GetMapping("/artists/findByArtistName")
	@ResponseBody
	public User findByArtistName(String artistName) {
		return this.userRepository.findByArtistName(artistName);
	}

	@PostMapping("/artists/changeAvatarOfArtist")
	@ResponseBody
	public User iframChangeImage(MultipartFile avatarOfArtist, String artistName) throws IOException {
		return this.userService.changeAvatarOfArtist(avatarOfArtist, artistName);
	}

	@GetMapping("/artists/findArtistByArtistNameInSearch")
	@ResponseBody
	public List<User> findArtistByArtistNameInSearch(String artistName) throws IOException {
		return this.userService.findByArtistNameInSearch(artistName);
	}

	@GetMapping("/artists/findAllPlaylistByPlaylistTitleInSearch")
	@ResponseBody
	public List<Playlist> findAllPlaylistByPlaylistTitleInSearch(String playlistTitle) throws IOException {
		return this.userService.findAllPlaylistByPlaylistTitleInSearch(playlistTitle);
	}

	@GetMapping("/artists/findAllTrackByTrackTitleInSearch")
	@ResponseBody
	public List<Track> findAllTrackByTrackTitleInSearch(String trackTitle) throws IOException {
		return this.userService.findAllTrackByTrackTitleInSearch(trackTitle);
	}

	@GetMapping("/artists/findTop15FollowingOfArtist")
	@ResponseBody
	public List<User> findTop15FollowingOfArtist(String artistName) throws IOException {
		return this.userService.findTop15FollowingOfArtist(artistName);
	}

	@GetMapping("/artists/conductFollowArtist")
	@ResponseBody
	public User conductFollowArtist(String artistName, Authentication authentication) throws IOException {
		return this.userService.conductFollowArtist(artistName, authentication.getName());
	}

	@GetMapping("/artists/cancelFollowArtist")
	@ResponseBody
	public User cancelFollowArtist(String artistName, Authentication authentication) throws IOException {
		return this.userService.cancelFollowArtist(artistName, authentication.getName());
	}
	
	@GetMapping("/artists/findById")
	@ResponseBody
	public User findById(Long id) throws IOException {
		return this.userService.findById(id);
	}
	
	@GetMapping("/artists/findCooperatorArtist")
	@ResponseBody
	public List<User>findCooperatorArtist(Authentication authentication) throws IOException {
		return this.userService.findAllFollowEachOtherList(authentication.getName());
	}
	
	@GetMapping("/artists/buyPackgeOfTurnOffAd")
	@ResponseBody
	public String buyPackgeOfTurnOffAd(Authentication authentication) throws IOException {
		return this.userService.buyPackgeOfTurnOffAd(authentication);
	}
	
	@GetMapping("/artists/totalTrack")
	@ResponseBody
	public int totalTrack(String artistName)  {
		return this.userService.totalTrack(artistName);
	}
	
	@GetMapping("/artists/findAllFollowingArtist")
	@ResponseBody
	public List<User> findAllFollowingArtist(String artistName)  {
		return this.userService.findAllFollowingArtist(artistName);
	}
	
	@GetMapping("/artists/findAllFollowerArtist")
	@ResponseBody
	public List<User> findAllFollowerArtist(String artistName)  {
		return this.userService.findAllFollowerArtist(artistName);
	}
	
	@GetMapping("/artists/profile")
	public String profilePage(Model model, Authentication authentication, String notification) {
		User user = this.userRepository.findByEmail(authentication.getName());
		model.addAttribute("user", user);
		model.addAttribute("countryList", this.countryRepository.findAll());
		if(notification != null) {
			model.addAttribute("notification", notification);
		}
		return "profile";
	}
	
	@PostMapping("/artists/changeProfile")
	public String changeProfile(Model model, User user, RedirectAttributes redirectAttributes) {
		String notification = this.userService.changeProfile(user);
		
		redirectAttributes.addAttribute("notification", notification);
		return "redirect:/artists/profile";
	}

}
