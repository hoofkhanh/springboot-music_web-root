package com.hokhanh.artist.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.SearchHistory;
import com.hokhanh.libary.service.SearchHistoryService;

@Controller
public class SearchHistoryController {
	
	@Autowired
	private SearchHistoryService searchHistoryService;

	@GetMapping("/searchHistory/findByUser")
	@ResponseBody
	public List<SearchHistory> findByUser(Authentication authentication){
		return this.searchHistoryService.findByUser(authentication);
	}

	@GetMapping("/searchHistory/add")
	@ResponseBody
	public List<SearchHistory> saveSearchHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.searchHistoryService.saveSearchHistory(trackTitle, playlistTitle, artistName, authentication);
	}
	
	@GetMapping("/searchHistory/delete")
	@ResponseBody
	public List<SearchHistory> deleteSearchHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.searchHistoryService.deleteSearchHistory(trackTitle, playlistTitle, artistName, authentication);
	}
	
	@GetMapping("/searchHistory/deleteAll")
	@ResponseBody
	public List<SearchHistory> deleteAllSearchHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication){
		return this.searchHistoryService.deleteAllSearchHistory( authentication);
	}
}
