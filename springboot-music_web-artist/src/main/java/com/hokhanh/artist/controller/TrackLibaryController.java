package com.hokhanh.artist.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.TrackLibary;
import com.hokhanh.libary.service.TrackLibaryService;

@Controller
public class TrackLibaryController {

	@Autowired
	private TrackLibaryService trackLibaryService;
	
	@GetMapping("/trackLibary/playlist/findAllLikedTrack")
	@ResponseBody
	public Playlist findAllLikedTrack(Authentication authentication){
		return this.trackLibaryService.findAllLikedTrack(authentication);
	}
	
	@GetMapping("/trackLibary/findByUser")
	@ResponseBody
	public List<TrackLibary> findByUser(Authentication authentication){
		return this.trackLibaryService.findByUser(authentication);
	}
	
	@GetMapping("/trackLibary/add")
	@ResponseBody
	public List<TrackLibary> addToLibary(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.trackLibaryService.addToLibary(trackTitle, playlistTitle, artistName, authentication);
	}
	
	@GetMapping("/trackLibary/delete")
	@ResponseBody
	public List<TrackLibary> deleteToLibary(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.trackLibaryService.deleteToLibary(trackTitle, playlistTitle, artistName, authentication);
	}
	
	
	
}
