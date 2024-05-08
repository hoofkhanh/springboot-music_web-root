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

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.service.PlaylistService;
import com.hokhanh.libary.service.TrackService;

@Controller
public class PlaylistController {

	@Autowired	
	private PlaylistService playlistService;

	@GetMapping("/playlists")
	@ResponseBody
	public List<Playlist> playlist(Authentication authentication) {
		return this.playlistService.findAllTrackOfArtist(authentication);
	}
	
	@PostMapping("/playlists/add")
	@ResponseBody
	public String playlistAdd(Model model, Playlist playlist , MultipartFile imageOfPlaylist, String allTrackHaveCheckedInCheckbox
			, int havePrivate, Authentication authentication, int haveAlbum) throws IOException {
		
		Playlist playlistAfterAdd =  this.playlistService.addPlaylistOfArtist(playlist, imageOfPlaylist, allTrackHaveCheckedInCheckbox, 
				authentication, havePrivate, haveAlbum);
		
		if(playlistAfterAdd == null) {
			return "Thất bại";
		}
		
		return "Thành công";
	}
	
	@GetMapping("/playlists/findByPlaylistTitle")
	@ResponseBody
	public Playlist findPlaylistByTrackTitle(String playlistTitle, Authentication authentication) {
		return this.playlistService.findPlaylistByPlaylistTitle(playlistTitle, authentication);
	}
	
	@GetMapping("/playlists/findPlaylistByPlaylistTitleInPageOfArtist")
	@ResponseBody
	public Playlist findPlaylistByPlaylistTitleInPageOfArtist(String playlistTitle, Authentication authentication) {
		return this.playlistService.findPlaylistByPlaylistTitleInPageOfArtist(playlistTitle);
	}
	
	@GetMapping("/playlists/findById")
	@ResponseBody
	public Playlist findPlaylistById(Long id, Authentication authentication) {
		return this.playlistService.findPlaylistById(id);
	}
	
	@GetMapping("/playlists/deleteByPlaylistTitle")
	@ResponseBody
	public String deleteByTrackTitle(String playlistTitle, Authentication authentication) {
		Playlist playlist = this.playlistService.deleteByPlaylistTitle(playlistTitle, authentication);
		if(playlist == null) {
			return "Không có tên: " + playlistTitle;
		}
		return "Xóa thành công: " + playlistTitle;
	}
	
	@GetMapping("/playlists/findAllTrackListOfPlaylist")
	@ResponseBody
	public List<Track> findAllTrackListOfPlaylistByPlaylistId(Long id, Authentication authentication) {
		return this.playlistService.findAllTrackListOfPlaylist(id);
	}
	
	@GetMapping("/playlists/findAllTrackListOfPlaylistByPlaylistTitle")
	@ResponseBody
	public List<Track> findAllTrackListOfPlaylistByPlaylistTitle(String playlistTitle, Authentication authentication) {
		return this.playlistService.findAllTrackListOfPlaylistByPlaylistTitle(playlistTitle, authentication);
	}
	
	@GetMapping("/playlists/findAllTrackListOfPlaylistByPlaylistTitleWhenPlayPlaylist")
	@ResponseBody
	public List<Track> findAllTrackListOfPlaylistByPlaylistTitleWhenPlayPlaylist(String playlistTitle, String trackTitle , Authentication authentication) {
		return this.playlistService.findAllTrackListOfPlaylistByPlaylistTitleWhenPlayPlaylist(playlistTitle, trackTitle);
	}
	
	@GetMapping("/playlists/findAllPlaylistByArtistName")
	@ResponseBody
	public List<Playlist> findAllPlaylistByArtistName(String artistName) {
		return this.playlistService.findAllPlaylistByArtistName(artistName);
	}
	
	@GetMapping("/playlists/findAllPlaylistByPlaylistTitleInSearch")
	@ResponseBody
	public List<Playlist> findAllPlaylistByPlaylistTitleInSearch(String playlistTitle) {
		return this.playlistService.findAllPlaylistByPlaylistTitleInSearch(playlistTitle);
	}
	
	@GetMapping("/playlists/checkPrivate")
	@ResponseBody
	public boolean checkPrivate(String playlistTitle) {
		return this.playlistService.checkPrivate(playlistTitle);
	}
}
