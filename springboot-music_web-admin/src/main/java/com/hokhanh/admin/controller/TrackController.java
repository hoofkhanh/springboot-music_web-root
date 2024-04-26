package com.hokhanh.admin.controller;

import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.service.GenreService;
import com.hokhanh.libary.service.TrackService;

@Controller
public class TrackController {
	
	@Autowired
	private GenreService genreService;
	
	@Autowired
	private TrackService trackService;

	@GetMapping("/tracks")
	public String trackPage(Model model) {
		model.addAttribute("title", "Track Page");
		model.addAttribute("genreList", this.genreService.findAllGenre());
		model.addAttribute("trackList", this.trackService.findAllTrack());
		return "tracks";
	}
	
//	@PostMapping("/tracks/addTrack")
//	public String addTrack(Model model, Track track, MultipartFile imageOfTrack, MultipartFile fileOfTrack, Authentication authentication,
//			int havePrivate) throws IOException {
//		Track trackAfterAdd =  trackService.addTrack(track, imageOfTrack, fileOfTrack, authentication, havePrivate);
//		if(trackAfterAdd == null) {
//			model.addAttribute("error", "Trùng tên bài hát");
//			model.addAttribute("track", track);
//			model.addAttribute("imageOfTrack", imageOfTrack.getOriginalFilename());
//			model.addAttribute("fileOfTrack", fileOfTrack.getOriginalFilename());
//			model.addAttribute("havePrivate", havePrivate);
//		}
//		
//		model.addAttribute("title", "Track Page");
//		model.addAttribute("genreList", this.genreService.findAllGenre());
//		model.addAttribute("trackList", this.trackService.findAllTrack());
//		return "tracks";
//	}
	
	@GetMapping("/tracks/delete")
	public String deleteTrack(Long id) {
		this.trackService.deleteTrackById(id);
		return "redirect:/tracks";
	}
	
	@GetMapping("/tracks/findById")
	@ResponseBody
	public Track findTrackById(Long id) {
		return this.trackService.findTrackById(id);
	}
}
