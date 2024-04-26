package com.hokhanh.admin.controller;

import java.io.IOException;
import java.util.Base64;
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
import com.hokhanh.libary.service.GenreService;
import com.hokhanh.libary.service.PlaylistService;
import com.hokhanh.libary.service.TrackService;

@Controller
public class PlaylistController {
	
	@Autowired
	private PlaylistService playlistService;
	
	@Autowired
	private TrackService trackService;
	
	@Autowired
	private GenreService genreService;
	
	@GetMapping("/playlists")
	public String playlistPage(Model model) {
		model.addAttribute("title", "Playlist Page");
		model.addAttribute("playlistList", this.playlistService.findAllPlaylist());
		return "playlists";
	}
	
	@GetMapping("/playlists/addPlaylistPage")
	public String addlaylistPage(Model model) {
		model.addAttribute("title", "Playlist Page");
		model.addAttribute("genreList", this.genreService.findAllGenre());
		model.addAttribute("trackList", this.trackService.findAllTrack());
		return "playlists-add-edit";
	}
	
	@PostMapping("/playlists/addPlaylist")
	public String addlaylist(Model model, Playlist playlist , MultipartFile imageOfPlaylist, String allTrackHaveCheckedInCheckbox
			, int havePrivate, Authentication authentication) throws IOException {			
		Playlist playlistAfterAdd =  this.playlistService.addPlaylist(playlist, imageOfPlaylist, allTrackHaveCheckedInCheckbox, 
				authentication, havePrivate);
		
		model.addAttribute("title", "Playlist Page");
		if(playlistAfterAdd == null ) {
			model.addAttribute("error", "Tên danh sách phát không được trùng và số lượng bài hát phải lớn hơn 0");
			model.addAttribute("playlist", playlist);
			model.addAttribute("imageOfPlaylist_Add", imageOfPlaylist.getOriginalFilename());
			model.addAttribute("allTrackHaveCheckedInCheckbox", allTrackHaveCheckedInCheckbox);
			model.addAttribute("havePrivate", havePrivate);
			model.addAttribute("genreList", this.genreService.findAllGenre());
			model.addAttribute("trackList", this.trackService.findAllTrack());
			return "playlists-add-edit";
		}
		
		model.addAttribute("playlistList", this.playlistService.findAllPlaylist());
		return "playlists";
	}
	
	@GetMapping("/playlists/editPlaylistPage")
	public String editPlaylistPage(Model model, Long id) throws IOException {
		model.addAttribute("title", "Playlist Page");
		
		Playlist playlist =  this.playlistService.findPlaylistById(id);
		model.addAttribute("playlist", playlist);
		model.addAttribute("imageOfPlaylist", playlist.getImage());
		
		String allTrackHaveCheckedInCheckbox = "";
		for (Track  track: this.playlistService.findAllTrackListOfPlaylist(id)) {
			allTrackHaveCheckedInCheckbox += track.getId() +" ";
			}
			allTrackHaveCheckedInCheckbox = allTrackHaveCheckedInCheckbox.trim();
		
		model.addAttribute("allTrackHaveCheckedInCheckbox", allTrackHaveCheckedInCheckbox);
		int havePrivate =1;
		if(playlist.isPrivate() == false) {
			havePrivate = 0;
		}		
		model.addAttribute("havePrivate", havePrivate);
		model.addAttribute("genreList", this.genreService.findAllGenre());
		model.addAttribute("trackList", this.trackService.findAllTrack());
		
		return "playlists-add-edit";
	}
	
	@PostMapping("/playlists/editPlaylist")
	public String editPlaylist(Model model, Playlist playlist , MultipartFile imageOfPlaylist, String allTrackHaveCheckedInCheckbox
			, int havePrivate, Authentication authentication, Long id) throws IOException {	
		Playlist playlistAfterEdit =  this.playlistService.editPlaylist(playlist, imageOfPlaylist, allTrackHaveCheckedInCheckbox, 
				authentication, havePrivate, id);
		Playlist checkImage = this.playlistService.findPlaylistById(id);
		
		model.addAttribute("title", "Playlist Page");
		if(playlistAfterEdit == null ) {
			model.addAttribute("error", "Tên danh sách phát không được trùng và số lượng bài hát phải lớn hơn 0");
			model.addAttribute("playlist", playlist);	
			model.addAttribute("imageOfPlaylist", checkImage.getImage());		
			model.addAttribute("allTrackHaveCheckedInCheckbox", allTrackHaveCheckedInCheckbox);
			model.addAttribute("havePrivate", havePrivate);
			model.addAttribute("genreList", this.genreService.findAllGenre());
			model.addAttribute("trackList", this.trackService.findAllTrack());
			return "playlists-add-edit";
		}
		
		model.addAttribute("playlistList", this.playlistService.findAllPlaylist());
		return "playlists";
	}
	
	@GetMapping("/playlists/delete")
	public String deletePlaylist(Long id) {
		this.playlistService.deletePlaylistById(id);
		return "redirect:/playlists";
	}
	
	@GetMapping("/playlists/findById")
	@ResponseBody
	public Playlist findPlaylistById(Long id) {
		return this.playlistService.findPlaylistById(id);
	}
	
	@GetMapping("/playlists/findAllTrackListOfPlaylist")
	@ResponseBody
	public List<Track> findAllTrackListOfPlaylist(Long id, Authentication authentication) {
		return this.playlistService.findAllTrackListOfPlaylist(id);
	}

}
