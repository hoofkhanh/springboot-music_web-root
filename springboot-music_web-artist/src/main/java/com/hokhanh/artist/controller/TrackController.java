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

import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.service.TrackService;

@Controller
public class TrackController {
	
	@Autowired
	private TrackService trackService;

	@GetMapping("/tracks")
	@ResponseBody
	public List<Track> tracks(Authentication authentication) {
		return this.trackService.findAllTrackOfArtist(authentication);
	}
	
	@GetMapping("/tracks/allTrack")
	@ResponseBody
	public List<Track> allTrack() {
		return this.trackService.findAllTrack();
	}
	
	@PostMapping("/tracks/add")
	@ResponseBody
	public String addTrack(Model model, Track track, MultipartFile imageOfTrack, MultipartFile fileOfTrack, Authentication authentication, int havePrivate,
			String cooperatorOfTrack) {
		Track trackAfterAdd =  this.trackService.addTrack(track, imageOfTrack, fileOfTrack, authentication, havePrivate, cooperatorOfTrack);
		if(trackAfterAdd == null) {
			return "Thật bại";
		}else {
			return "Thành công";
		}
	}
	
	@GetMapping("/tracks/findByTrackTitle")
	@ResponseBody
	public Track findTrackByTrackTitle(String trackTitle, Authentication authentication) {
		return this.trackService.findTrackByTrackTitle(trackTitle, authentication);
	}
	
	@GetMapping("/tracks/findByTrackTitleOfArtist")
	@ResponseBody
	public Track findByTrackTitleOfArtist(String trackTitle) {
		return this.trackService.findByTrackTitleOfArtist(trackTitle);
	}
	
	@GetMapping("/tracks/deleteByTrackTitle")
	@ResponseBody
	public String deleteByTrackTitle(String trackTitle, Authentication authentication) {
		Track track = this.trackService.deleteTrackByTrackTitle(trackTitle, authentication);
		if(track == null) {
			return "Không có tên: " + trackTitle ;
		}
		return "Xóa thành công: " + trackTitle;
	}
	
	@GetMapping("/tracks/findAllTrackGenreTogether")
	@ResponseBody
	public List<Track> playTrack(String trackTitle, Authentication authentication) {
		List<Track> allTrackGenreTogether = this.trackService.findAllTrackGenreTogether(trackTitle, authentication.getName());
		return allTrackGenreTogether;
	}
	
	@GetMapping("/tracks/findAllTrackGenreTogetherNotInTheQueue")
	@ResponseBody
	public List<Track> playTrackWhenNoMoreTrack(String trackTitle, Authentication authentication) {
		List<Track> allTrackGenreTogether = this.trackService.findAllTrackGenreTogetherNotInTheQueue(trackTitle, authentication.getName());
		return allTrackGenreTogether;
	}
	
	@GetMapping("/tracks/findAllTrackByArtistName")
	@ResponseBody
	public List<Track> findAllTrackByArtistName(String artistName, Authentication authentication) {
		List<Track> allTrackByArtistName= this.trackService.findAllTrackByArtistName(artistName);
		return allTrackByArtistName;
	}
	
	@GetMapping("/tracks/findAllTrackByArtistNameInSeeAll")
	@ResponseBody
	public List<Track> findAllTrackByArtistNameInSeeAll(String artistName, Authentication authentication) {
		List<Track> allTrackByArtistName= this.trackService.findAllTrackByArtistNameInSeeAll(artistName);
		return allTrackByArtistName;
	}
	
	@GetMapping("/tracks/findAllTrackByTrackTitleInSearch")
	@ResponseBody
	public List<Track> findAllTrackByArtistNameInSearch(String trackTitle) {
		List<Track> allTrackByArtistName= this.trackService.findAllTrackByTrackTitleInSearch(trackTitle);
		return allTrackByArtistName;
	}
	
	@GetMapping("/tracks/increaseNumberOfListenByTrackTitle")
	@ResponseBody
	public String increaseNumberOfListenByTrackTitle(String trackTitle) {
		this.trackService.increaseNumberOfListenByTrackTitle(trackTitle);
		return "Đã tăng";
	}
	

}
