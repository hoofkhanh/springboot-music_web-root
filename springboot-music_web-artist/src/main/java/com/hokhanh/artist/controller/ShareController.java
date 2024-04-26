package com.hokhanh.artist.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.Shareable;
import com.hokhanh.libary.service.ShareService;

@Controller
public class ShareController {
	
	@Autowired
	private ShareService shareService;

	@GetMapping("/share/add")
	@ResponseBody
	public void shareTrackOrPlaylist(String trackTitle, String playlistTitle, String shareMessage, Authentication authentication){
		this.shareService.shareTrackOrPlaylist(trackTitle, playlistTitle, shareMessage, authentication.getName());
	}
	
	@GetMapping("/share/getShareableByArtist")
	@ResponseBody
	public List<Shareable> getShareableByArtist(String artistName, Authentication authentication){
		return this.shareService.getShareableByArtist(artistName);
	}
	
	@GetMapping("/share/delete")
	@ResponseBody
	public List<Shareable> deleteShareable(Long id, Authentication authentication){
		return this.shareService.deleteShareable( id,  authentication);
	}
}
