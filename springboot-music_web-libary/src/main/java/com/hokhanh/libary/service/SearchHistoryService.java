package com.hokhanh.libary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.SearchHistory;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.PlaylistRepository;
import com.hokhanh.libary.repository.SearchHistoryRepository;
import com.hokhanh.libary.repository.TrackRepository;
import com.hokhanh.libary.repository.UserRepository;

@Service
public class SearchHistoryService {

	@Autowired
	private SearchHistoryRepository searchHistoryRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private TrackRepository trackRepository;
	
	@Autowired
	private PlaylistRepository playlistRepository;
	
	public List<SearchHistory> saveSearchHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication) {
		Track track = null;
		Playlist playlist = null;
		User artist = null;
		
		User searcher = this.userRepository.findByEmail(authentication.getName());
		
		if(trackTitle != null) {
			track = this.trackRepository.findByTrackTitle(trackTitle);
			SearchHistory searchHistory = this.searchHistoryRepository.findBySearcherAndTrack(searcher, track);
			if(searchHistory != null) {
				this.searchHistoryRepository.deleteById(searchHistory.getId());
			}
		}else if(playlistTitle != null) {
			playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
			SearchHistory searchHistory = this.searchHistoryRepository.findBySearcherAndPlaylist(searcher, playlist);
			if(searchHistory != null) {
				this.searchHistoryRepository.deleteById(searchHistory.getId());
			}
		}else {
			artist = this.userRepository.findByArtistName(artistName);
			SearchHistory searchHistory = this.searchHistoryRepository.findBySearcherAndUser(searcher, artist);
			
			if(searchHistory != null) {
				this.searchHistoryRepository.deleteById(searchHistory.getId());
			}
			
		}
		
		SearchHistory searchHistory = new SearchHistory();
		searchHistory.setSearcher(searcher);
		searchHistory.setTrack(track);
		searchHistory.setPlaylist(playlist);
		searchHistory.setUser(artist);
		
		this.searchHistoryRepository.save(searchHistory);
		
		return this.searchHistoryRepository.findBySearcher(searcher.getId());
	}


	public List<SearchHistory> findByUser(Authentication authentication) {
		return this.searchHistoryRepository.findBySearcher(this.userRepository.findByEmail(authentication.getName()).getId());
	}


	public List<SearchHistory> deleteSearchHistory(String trackTitle, String playlistTitle, String artistName,
			Authentication authentication) {
		Track track = null;
		Playlist playlist = null;
		User artist = null;
		
		User searcher = this.userRepository.findByEmail(authentication.getName());
		
		if(trackTitle != null) {
			track = this.trackRepository.findByTrackTitle(trackTitle);
			SearchHistory searchHistory = this.searchHistoryRepository.findBySearcherAndTrack(searcher, track);
			if(searchHistory != null) {
				this.searchHistoryRepository.deleteById(searchHistory.getId());
			}
		}else if(playlistTitle != null) {
			playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
			SearchHistory searchHistory = this.searchHistoryRepository.findBySearcherAndPlaylist(searcher, playlist);
			if(searchHistory != null) {
				this.searchHistoryRepository.deleteById(searchHistory.getId());
			}
		}else {
			artist = this.userRepository.findByArtistName(artistName);
			SearchHistory searchHistory = this.searchHistoryRepository.findBySearcherAndUser(searcher, artist);
			if(searchHistory != null) {
				this.searchHistoryRepository.deleteById(searchHistory.getId());
			}
			
		}

		return this.searchHistoryRepository.findBySearcher(searcher.getId());
	}


	public List<SearchHistory> deleteAllSearchHistory(Authentication authentication) {
		User searcher = this.userRepository.findByEmail(authentication.getName());
		List<SearchHistory> searchHistoryList = this.searchHistoryRepository.findBySearcher(searcher.getId());
		
		if(searchHistoryList != null && !searchHistoryList.isEmpty()) {
			for (SearchHistory searchHistory : searchHistoryList) {
				this.searchHistoryRepository.deleteById(searchHistory.getId());
			}
		}
		
		return this.searchHistoryRepository.findBySearcher(searcher.getId());
	}
}
