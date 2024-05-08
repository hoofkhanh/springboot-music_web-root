package com.hokhanh.libary.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.MasterPlaylist;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.SearchHistory;
import com.hokhanh.libary.model.Shareable;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.TrackLibary;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.ListeningHistoryRepository;
import com.hokhanh.libary.repository.MasterPlaylistRepository;
import com.hokhanh.libary.repository.PlaylistRepository;
import com.hokhanh.libary.repository.SearchHistoryRepository;
import com.hokhanh.libary.repository.ShareableRepository;
import com.hokhanh.libary.repository.TrackLibaryRepository;
import com.hokhanh.libary.repository.TrackRepository;
import com.hokhanh.libary.repository.UserRepository;

@Service
public class PlaylistService {

	@Autowired
	private PlaylistRepository playlistRepository;
	
	@Autowired
	private AdminService adminService;
	
	@Autowired
	private TrackService trackService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private MasterPlaylistRepository masterPlaylistRepository;
	
	@Autowired
	private ListeningHistoryRepository historyRepository;
	
	@Autowired
	private SearchHistoryRepository searchHistoryRepository;
	
	@Autowired
	private ShareableRepository shareableRepository;
	
	@Autowired
	private TrackLibaryRepository trackLibaryRepository;
	
	@Autowired
	private TrackRepository trackRepository;
	
	
	
	public List<Playlist> findAllPlaylist() {
		return this.playlistRepository.findAllPlaylistSortId();
	}
	
	public List<Playlist> findAllTrackOfArtist(Authentication authentication) {
		User user = this.userRepository.findByEmail(authentication.getName());
		return this.playlistRepository.findByUserSortId(user.getId());
	}

	public Playlist addPlaylist(Playlist playlist, MultipartFile imageOfPlaylist, String allTrackHaveCheckedInCheckbox,Authentication authentication 
			,int havePrivate) throws IOException {
		Playlist duplicateName = playlistRepository.findByPlaylistTitle(playlist.getPlaylistTitle());
		if(duplicateName != null || allTrackHaveCheckedInCheckbox.equals("")) {
			return null;
		}
		
		playlist.setDateAdded(LocalDate.now());
		
		playlist.setImage(Base64.getEncoder().encodeToString(imageOfPlaylist.getBytes()));
		
		playlist.setAlbum(false);
		if(havePrivate == 1) {
			playlist.setPrivate(true);
		}else {
			playlist.setPrivate(false);
		}
		
		String[] allIdOfTrack = allTrackHaveCheckedInCheckbox.split(" ");
		playlist.setNumberOfTracks(allIdOfTrack.length);
		
		playlist.setUser(adminService.findAdminByEmail(authentication.getName()));
		
		List<Track> allTrackAdded = new ArrayList<>();
		for (String idOfTrack : allIdOfTrack) {
			Long idOfTrackInt =  Long.parseLong(idOfTrack);
			Track track = this.trackService.findTrackById(idOfTrackInt);
			allTrackAdded.add(track);
		}
		playlist.setTrackList(allTrackAdded);
		
		return this.playlistRepository.save(playlist);
	}
	
	public Playlist findPlaylistById(Long id) {
		return this.playlistRepository.findById(id).get();
	}
	
	public Playlist editPlaylist(Playlist playlist, MultipartFile imageOfPlaylist, String allTrackHaveCheckedInCheckbox,Authentication authentication 
			,int havePrivate, Long id) throws IOException {
		Playlist duplicateName = playlistRepository.findByPlaylistTitle(playlist.getPlaylistTitle());
		if(duplicateName != null || allTrackHaveCheckedInCheckbox.equals("")) {
			if(duplicateName!= null && duplicateName.getId() != id) {		
				return null;
			}else if(allTrackHaveCheckedInCheckbox.equals("")) {
				return null;
			}
		}
		
		Playlist playlistFindById = this.findPlaylistById(id);
		playlistFindById.setPlaylistTitle(playlist.getPlaylistTitle());
		
		if(!imageOfPlaylist.isEmpty()) {
			playlistFindById.setImage(Base64.getEncoder().encodeToString(imageOfPlaylist.getBytes()));
		}
		
		if(havePrivate == 1) {
			playlistFindById.setPrivate(true);
		}else {
			playlistFindById.setPrivate(false);
		}
		
		String[] allIdOfTrack = allTrackHaveCheckedInCheckbox.split(" ");
		
		playlistFindById.setNumberOfTracks(allIdOfTrack.length);
		
		playlistFindById.setUser(adminService.findAdminByEmail(authentication.getName()));
		
		List<Track> allTrackAdded = new ArrayList<>();
		for (String idOfTrack : allIdOfTrack) {
			Long idOfTrackInt =  Long.parseLong(idOfTrack);
			Track track = this.trackService.findTrackById(idOfTrackInt);
			allTrackAdded.add(track);
		}
		playlistFindById.setTrackList(allTrackAdded);
		
		
		return this.playlistRepository.save(playlistFindById);
	}

	public void deletePlaylistById(Long idOfPlaylist) {
		Playlist playlist = this.playlistRepository.findById(idOfPlaylist).get();
		List<Long> ids = this.masterPlaylistRepository.findMasterPlaylistByPlayList(playlist.getId());
		
		if(ids != null && !ids.isEmpty()) {
			for (Long id : ids) {
				MasterPlaylist masterPlaylist = this.masterPlaylistRepository.findById(id).get();
				masterPlaylist.getPlaylistList().remove(playlist);
				this.masterPlaylistRepository.save(masterPlaylist);
			}
		}
		
		this.historyRepository.deleteAllByPlaylist(playlist);
		this.searchHistoryRepository.deleteAllByPlaylist(playlist);
		this.shareableRepository.deleteAllByPlaylist(playlist);
		this.trackLibaryRepository.deleteAllByPlaylist(playlist);
		
		this.playlistRepository.deleteById(idOfPlaylist);
	}

	public Playlist addPlaylistOfArtist(Playlist playlist, MultipartFile imageOfPlaylist,
			String allTrackHaveCheckedInCheckbox, Authentication authentication, int havePrivate, int haveAlbum) throws IOException {
		Playlist duplicateName = playlistRepository.findByPlaylistTitle(playlist.getPlaylistTitle());
		if(duplicateName != null  || allTrackHaveCheckedInCheckbox.equals("")) {
			if(playlist.getId() != null && duplicateName.getId() != playlist.getId()) {
				return null;
			}else if(playlist.getId() == null) {
				return null;
			}else if(allTrackHaveCheckedInCheckbox.equals("")) {
				return null;
			}
		}
		
		Playlist playlistFromDatabase = null;
		if(playlist.getId() != null) {
			playlistFromDatabase = this.playlistRepository.findById(playlist.getId()).get();
		}
		
		if(!imageOfPlaylist.isEmpty()) {
			playlist.setImage(Base64.getEncoder().encodeToString(imageOfPlaylist.getBytes()));
		}else {
			if(playlistFromDatabase != null && playlistFromDatabase.getImage() != null && !playlistFromDatabase.getImage().equals("")) {
				playlist.setImage(playlistFromDatabase.getImage());
			}
		}
		
		if(playlistFromDatabase != null) {
			playlist.setDateAdded(playlistFromDatabase.getDateAdded());
		}else {
			playlist.setDateAdded(LocalDate.now());
		}
		
		if(havePrivate == 1) {
			playlist.setPrivate(true);
		}else {
			playlist.setPrivate(false);
		}
		
		
		if(haveAlbum == 1) {
			playlist.setAlbum(true);
		}else {
			playlist.setAlbum(false);
		}
		
		String[] allIdOfTrack = allTrackHaveCheckedInCheckbox.split(" ");
		playlist.setNumberOfTracks(allIdOfTrack.length);
		
		playlist.setUser(userService.findUserByEmail(authentication.getName()));
		
		List<Track> allTrackAdded = new ArrayList<>();
		for (String idOfTrack : allIdOfTrack) {
			Long idOfTrackInt =  Long.parseLong(idOfTrack);
			Track track = this.trackService.findTrackById(idOfTrackInt);
			allTrackAdded.add(track);
		}
		playlist.setTrackList(allTrackAdded);
		
		return this.playlistRepository.save(playlist);
	}

	public Playlist findPlaylistByPlaylistTitle(String playlistTitle, Authentication authentication) {
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);	
		
		if(playlist == null) {
			return null;
		}else if(!playlist.getUser().getEmail().equals(authentication.getName())) {
			return null;
		}
		
		return this.playlistRepository.findByPlaylistTitle(playlistTitle);
	}
	
	public Playlist findPlaylistByPlaylistTitleInPageOfArtist(String playlistTitle) {
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
		List<Track> trackList = new ArrayList<>();
		for (Long idOfTrack : playlistRepository.findAllTrackOfPlaylist(playlist.getId())) {
			trackList.add(this.trackRepository.findById(idOfTrack).get());
		}
		
		playlist.setTrackList(trackList);
		
		return playlist;
	}

	public Playlist deleteByPlaylistTitle(String playlistTitle, Authentication authentication) {
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
		if(playlist == null ) {
			return null;
		}else {
			List<Long> ids = this.masterPlaylistRepository.findMasterPlaylistByPlayList(playlist.getId());
			if(!playlist.getUser().getEmail().equals(authentication.getName())) {
				return null;
			}else if(ids != null && !ids.isEmpty()) {
	
				for (Long id : ids) {
					MasterPlaylist masterPlaylist = this.masterPlaylistRepository.findById(id).get();
					masterPlaylist.getPlaylistList().remove(playlist);
					this.masterPlaylistRepository.save(masterPlaylist);
				}
			
			}
			
			this.historyRepository.deleteAllByPlaylist(playlist);
			this.searchHistoryRepository.deleteAllByPlaylist(playlist);
			this.shareableRepository.deleteAllByPlaylist(playlist);
			this.trackLibaryRepository.deleteAllByPlaylist(playlist);
			
			this.playlistRepository.deleteById(playlist.getId());
			return playlist;
		}
	}

	public List<Track> findAllTrackListOfPlaylist(Long id) {
		List<Long> allIdOfTrack = this.playlistRepository.findTrackListByPlaylistId(id);
		List<Track> allTrack = new ArrayList<>();
		for (Long idOfTrack : allIdOfTrack) {
			allTrack.add(this.trackService.findTrackById(idOfTrack));
		}
		return allTrack;
	}

	public List<Track> findAllTrackListOfPlaylistByPlaylistTitle(String playlistTitle,  Authentication authentication) {
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
		List<Long> allIdOfTrack = this.playlistRepository.findTrackListByPlaylistId(playlist.getId());
		List<Track> allTrack = new ArrayList<>();
		for (Long idOfTrack : allIdOfTrack) {
			Track track = this.trackService.findTrackById(idOfTrack);
			if(track.isPrivate() == true) {
				if(this.userRepository.findByEmail(authentication.getName()).getArtistName().equals(track.getUser().getArtistName())) {
					allTrack.add(track);
				}
			}else {
				allTrack.add(track);
			}
			
		}
		return allTrack;
	}

	public List<Track> findAllTrackListOfPlaylistByPlaylistTitleWhenPlayPlaylist(String playlistTitle,
			String trackTitle) {
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
		List<Long> allIdOfTrack = this.playlistRepository.findTrackListByPlaylistId(playlist.getId());
		List<Track> allTrack = new ArrayList<>();
		boolean check=false;
		for (Long idOfTrack : allIdOfTrack) {
			Track track = this.trackService.findTrackById(idOfTrack);
			if(track.getTrackTitle().equals(trackTitle) == false){
				check = true;
				allTrack.add(track);
			}
			
			if(check == true) {
				allTrack.add(track);
			}
		}
		
		return allTrack;
	}

	public List<Playlist> findAllPlaylistByArtistName(String artistName) {
		User artist = this.userRepository.findByArtistName(artistName);
		return this.playlistRepository.findByUserSortId(artist.getId());
	}

	public List<Playlist> findAllPlaylistByPlaylistTitleInSearch(String playlistTitle) {
		return this.playlistRepository.findAllPlaylistByPlaylistTitleInSearch(playlistTitle);
	}

	public boolean checkPrivate(String playlistTitle) {
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
		return playlist.isPrivate();
	}

	
	

}
