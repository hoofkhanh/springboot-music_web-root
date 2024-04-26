package com.hokhanh.artist.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hokhanh.libary.model.MasterPlaylist;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.service.MasterPlaylistService;

@Controller
public class MasterPlaylistController {

	@Autowired
	private MasterPlaylistService masterPlaylistService;
	
	@GetMapping("/masterPlaylist/findAllMasterPlaylist")
	@ResponseBody
	public List<MasterPlaylist> findAllMasterPlaylist(){
		return this.masterPlaylistService.findAllMasterPlaylistInArtist();
	}
	
	@GetMapping("/masterPlaylist/findPlaylistOfMasterPlaylist")
	@ResponseBody
	public List<Playlist> findPlaylistOfMasterPlaylist(Long id){
		return this.masterPlaylistService.findPlaylistOfMasterPlaylist(id);
	}
}
