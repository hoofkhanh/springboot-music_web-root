package com.hokhanh.artist.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.service.ListeningHistoryService;

@Controller
public class ListeningHistoryController {
	
	@Autowired
	private ListeningHistoryService listeningHistoryService;
	
	@GetMapping("/listeningHistory/findByUser")
	@ResponseBody
	public List<ListeningHistory> findByUser(Authentication authentication){
		return this.listeningHistoryService.findByUser(authentication);
	}

	@GetMapping("/listeningHistory/add")
	@ResponseBody
	public List<ListeningHistory> saveListeningHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.listeningHistoryService.saveListeningHistory(trackTitle, playlistTitle, artistName, authentication);
	}
	
	@GetMapping("/listeningHistory/delete")
	@ResponseBody
	public List<ListeningHistory> deleteListeningHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.listeningHistoryService.deleteListeningHistory(trackTitle, playlistTitle, artistName, authentication);
	}
	
	@GetMapping("/listeningHistory/deleteAll")
	@ResponseBody
	public List<ListeningHistory> deleteAllListeningHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.listeningHistoryService.deleteAllListeningHistory( authentication);
	}
}
