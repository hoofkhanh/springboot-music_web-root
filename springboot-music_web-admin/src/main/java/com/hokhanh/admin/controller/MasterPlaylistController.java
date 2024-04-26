package com.hokhanh.admin.controller;

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

import com.hokhanh.libary.model.MasterPlaylist;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.service.MasterPlaylistService;
import com.hokhanh.libary.service.PlaylistService;

@Controller
public class MasterPlaylistController {
	
	@Autowired
	private MasterPlaylistService masterPlaylistService;
	
	@Autowired
	private PlaylistService playlistService;

	@GetMapping("/masterPlaylists")
	public String playlistPage(Model model) {
		model.addAttribute("title", "Master Playlist Page");
		model.addAttribute("masterPlaylistList", this.masterPlaylistService.findAllMasterPlaylist());
		return "master-playlists";
	}
	
	@GetMapping("/masterPlaylists/addMasterPlaylistPage")
	public String addMasterPlaylistPage(Model model) {
		model.addAttribute("title", "Master Playlist Page");
		model.addAttribute("playlistList", this.playlistService.findAllPlaylist());
		return "master-playlists-add-edit";
	}
	
	@PostMapping("/masterPlaylists/addMasterPlaylist")
	public String addMasterPlaylist(Model model, MasterPlaylist masterPlaylist , String allTrackHaveCheckedInCheckbox, Authentication authentication) throws IOException {			
		MasterPlaylist  masterPlaylistAfterAdd =  this.masterPlaylistService.addMasterPlaylist(masterPlaylist, allTrackHaveCheckedInCheckbox, 
				authentication);
		
		model.addAttribute("title", "Master Playlist Page");
		if(masterPlaylistAfterAdd == null ) {
			model.addAttribute("error", "Tên siêu danh sách phát không được trùng và số lượng danh sách phải lớn hơn 0");
			model.addAttribute("masterPlaylist", masterPlaylist);
			model.addAttribute("allTrackHaveCheckedInCheckbox", allTrackHaveCheckedInCheckbox);
			model.addAttribute("playlistList", this.playlistService.findAllPlaylist());
			return "master-playlists-add-edit";
		}
		
		model.addAttribute("masterPlaylistList", this.masterPlaylistService.findAllMasterPlaylist());
		return "master-playlists";
	}
	
	@GetMapping("/masterPlaylists/editMasterPlaylistPage")
	public String editMasterPlaylistPage(Model model, Long id) throws IOException {
		model.addAttribute("title", "Master Playlist Page");
		
		MasterPlaylist masterPlaylist =  this.masterPlaylistService.findMasterPlaylistById(id);
		model.addAttribute("masterPlaylist", masterPlaylist);
		
		String allTrackHaveCheckedInCheckbox = "";
		for (Playlist  playlist: this.masterPlaylistService.findAllPlaylistListOfMasterPlaylist(id)) {
			allTrackHaveCheckedInCheckbox += playlist.getId() +" ";
			}
			allTrackHaveCheckedInCheckbox = allTrackHaveCheckedInCheckbox.trim();
		
		model.addAttribute("allTrackHaveCheckedInCheckbox", allTrackHaveCheckedInCheckbox);
		model.addAttribute("playlistList", this.playlistService.findAllPlaylist());
		
		return "master-playlists-add-edit";
	}
		
	@PostMapping("/masterPlaylists/editMasterPlaylist")
	public String editMasterPlaylist(Model model, MasterPlaylist masterPlaylist , String allTrackHaveCheckedInCheckbox,
		Authentication authentication, Long id) throws IOException {	
		MasterPlaylist masterPlaylistAfterEdit =  this.masterPlaylistService.editMasterPlaylist(masterPlaylist, allTrackHaveCheckedInCheckbox, 
				authentication, id);
		
		model.addAttribute("title", "Master Playlist Page");
		if(masterPlaylistAfterEdit == null ) {
			model.addAttribute("error", "Tên siêu danh sách phát không được trùng và số lượng danh sách phải lớn hơn 0");
			model.addAttribute("masterPlaylist", masterPlaylist);	
			model.addAttribute("allTrackHaveCheckedInCheckbox", allTrackHaveCheckedInCheckbox);
			model.addAttribute("playlistList", this.playlistService.findAllPlaylist());
			return "master-playlists-add-edit";
		}
		
		model.addAttribute("masterPlaylistList", this.masterPlaylistService.findAllMasterPlaylist());
		return "master-playlists";
	}
	
	@GetMapping("/masterPlaylists/delete")
	public String deleteMasterPlaylist(Long id) {
		this.masterPlaylistService.deleteMasterPlaylistById(id);
		return "redirect:/masterPlaylists";
	}
	
	@GetMapping("/masterPlaylists/findById")
	@ResponseBody
	public MasterPlaylist findMasterPlaylistById(Long id) {
		return this.masterPlaylistService.findMasterPlaylistById(id);
	}
	
	@GetMapping("/masterPlaylists/findAllTrackListOfPlaylist")
	@ResponseBody
	public List<Playlist> findAllPlaylistListOfMasterPlaylist(Long id, Authentication authentication) {
		return this.masterPlaylistService.findAllPlaylistListOfMasterPlaylist(id);
	}
}
