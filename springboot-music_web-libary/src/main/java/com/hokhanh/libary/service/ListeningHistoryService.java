package com.hokhanh.libary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.ListeningHistoryRepository;
import com.hokhanh.libary.repository.PlaylistRepository;
import com.hokhanh.libary.repository.TrackRepository;
import com.hokhanh.libary.repository.UserRepository;

@Service
public class ListeningHistoryService {

	@Autowired
	private ListeningHistoryRepository historyRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private TrackRepository trackRepository;
	
	@Autowired
	private PlaylistRepository playlistRepository;
	

	public List<ListeningHistory> saveListeningHistory(String trackTitle, String playlistTitle, String artistName, Authentication authentication) {
		Track track = null;
		Playlist playlist = null;
		User artist = null;
		
		User listener = this.userRepository.findByEmail(authentication.getName());
		
		if(trackTitle != null) {
			track = this.trackRepository.findByTrackTitle(trackTitle);
			ListeningHistory listeningHistory = this.historyRepository.findByListenerAndTrack(listener, track);
			if(listeningHistory != null) {
				this.historyRepository.deleteById(listeningHistory.getId());
			}
		}else if(playlistTitle != null) {
			playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
			ListeningHistory listeningHistory = this.historyRepository.findByListenerAndPlaylist(listener, playlist);
			if(listeningHistory != null) {
				this.historyRepository.deleteById(listeningHistory.getId());
			}
		}else {
			artist = this.userRepository.findByArtistName(artistName);
			ListeningHistory listeningHistory = this.historyRepository.findByListenerAndUser(listener, artist);
			if(listeningHistory != null) {
				this.historyRepository.deleteById(listeningHistory.getId());
			}
			
		}
		
		ListeningHistory listeningHistory = new ListeningHistory();
		listeningHistory.setListener(listener);
		listeningHistory.setTrack(track);
		listeningHistory.setPlaylist(playlist);
		listeningHistory.setUser(artist);
		
		this.historyRepository.save(listeningHistory);
		
		return this.historyRepository.findByListener(listener.getId());
	}


	public List<ListeningHistory> findByUser(Authentication authentication) {
		return this.historyRepository.findByListener(this.userRepository.findByEmail(authentication.getName()).getId());
	}


	public List<ListeningHistory> deleteListeningHistory(String trackTitle, String playlistTitle, String artistName,
			Authentication authentication) {
		Track track = null;
		Playlist playlist = null;
		User artist = null;
		
		User listener = this.userRepository.findByEmail(authentication.getName());
		
		if(trackTitle != null) {
			track = this.trackRepository.findByTrackTitle(trackTitle);
			ListeningHistory listeningHistory = this.historyRepository.findByListenerAndTrack(listener, track);
			if(listeningHistory != null) {
				this.historyRepository.deleteById(listeningHistory.getId());
			}
		}else if(playlistTitle != null) {
			playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
			ListeningHistory listeningHistory = this.historyRepository.findByListenerAndPlaylist(listener, playlist);
			if(listeningHistory != null) {
				this.historyRepository.deleteById(listeningHistory.getId());
			}
		}else {
			artist = this.userRepository.findByArtistName(artistName);
			ListeningHistory listeningHistory = this.historyRepository.findByListenerAndUser(listener, artist);
			if(listeningHistory != null) {
				this.historyRepository.deleteById(listeningHistory.getId());
			}
			
		}

		return this.historyRepository.findByListener(listener.getId());
	}


	public List<ListeningHistory> deleteAllListeningHistory(Authentication authentication) {
		User listener = this.userRepository.findByEmail(authentication.getName());
		List<ListeningHistory> listeningHistoryList = this.historyRepository.findByListener(listener.getId());
		
		if(listeningHistoryList != null && !listeningHistoryList.isEmpty()) {
			for (ListeningHistory listeningHistory : listeningHistoryList) {
				this.historyRepository.deleteById(listeningHistory.getId());
			}
		}
		
		return this.historyRepository.findByListener(listener.getId());
	}
}
