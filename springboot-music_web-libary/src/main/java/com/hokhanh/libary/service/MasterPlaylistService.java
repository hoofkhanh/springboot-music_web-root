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

import com.hokhanh.libary.model.MasterPlaylist;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.repository.MasterPlaylistRepository;

@Service
public class MasterPlaylistService {
	
	@Autowired
	private MasterPlaylistRepository masterPlaylistRepository;

	@Autowired
	private AdminService adminService;
	
	@Autowired
	private PlaylistService playlistService;
	
	public List<MasterPlaylist> findAllMasterPlaylist() {
		return this.masterPlaylistRepository.findAllMasterPlaylistSortId();
	}
	
	public List<MasterPlaylist> findAllMasterPlaylistInArtist() {
		List<MasterPlaylist> masterPlaylist = this.masterPlaylistRepository.findAllMasterPlaylistSortId();
		if(masterPlaylist != null && masterPlaylist.isEmpty() == false) {
			for (MasterPlaylist mtpl : masterPlaylist) {
				List<Long> allIdPlaylist = this.masterPlaylistRepository.findPlaylistOfMasterPlaylist(mtpl.getId());
				
				List<Playlist> playlistList = new ArrayList<>();
				if(allIdPlaylist != null && allIdPlaylist.isEmpty() == false) {
					for (Long newId : allIdPlaylist) {
						Playlist playlist = this.playlistService.findPlaylistById(newId);
						playlistList.add(playlist);
					}
				}
				
				mtpl.setPlaylistList(playlistList);
			}
		}
		return masterPlaylist;
	}
	
	public MasterPlaylist addMasterPlaylist(MasterPlaylist masterPlaylist, String allTrackHaveCheckedInCheckbox,Authentication authentication) throws IOException {
		MasterPlaylist duplicateName = masterPlaylistRepository.findByTitleOfMasterPlaylist(masterPlaylist.getTitleOfMasterPlaylist());
		if(duplicateName != null || allTrackHaveCheckedInCheckbox.equals("")) {
			return null;
		}
		
		masterPlaylist.setUser(adminService.findAdminByEmail(authentication.getName()));
		
		String[] allIdOfPlaylist = allTrackHaveCheckedInCheckbox.split(" ");
		List<Playlist> allPlaylistAdded = new ArrayList<>();
		for (String idOfPlaylist : allIdOfPlaylist) {
			Long idOfPlaylistInt =  Long.parseLong(idOfPlaylist);
			Playlist playlist = this.playlistService.findPlaylistById(idOfPlaylistInt);
			allPlaylistAdded.add(playlist);
		}
		masterPlaylist.setPlaylistList(allPlaylistAdded);
		
		
		return this.masterPlaylistRepository.save(masterPlaylist);
	}
	
	public MasterPlaylist findMasterPlaylistById(Long id) {
		return this.masterPlaylistRepository.findById(id).get();
	}

	public MasterPlaylist editMasterPlaylist(MasterPlaylist masterPlaylist, String allTrackHaveCheckedInCheckbox,
			Authentication authentication, Long id) {
		MasterPlaylist duplicateName = this.masterPlaylistRepository.findByTitleOfMasterPlaylist(masterPlaylist.getTitleOfMasterPlaylist());
		if(duplicateName != null || allTrackHaveCheckedInCheckbox.equals("")) {
			if(duplicateName!= null && duplicateName.getId() != id) {		
				return null;
			}else if(allTrackHaveCheckedInCheckbox.equals("")) {
				return null;
			}
		}
		
		MasterPlaylist masterPlaylistFindById = this.findMasterPlaylistById(id);
		masterPlaylistFindById.setTitleOfMasterPlaylist(masterPlaylistFindById.getTitleOfMasterPlaylist());
				
		masterPlaylist.setUser(adminService.findAdminByEmail(authentication.getName()));
		
		String[] allIdOfPlaylist = allTrackHaveCheckedInCheckbox.split(" ");
		List<Playlist> allPlaylistAdded = new ArrayList<>();
		for (String idOfPlaylist : allIdOfPlaylist) {
			Long idOfPlaylistInt =  Long.parseLong(idOfPlaylist);
			Playlist playlist = this.playlistService.findPlaylistById(idOfPlaylistInt);
			allPlaylistAdded.add(playlist);
		}
		masterPlaylist.setPlaylistList(allPlaylistAdded);
		
		
		return this.masterPlaylistRepository.save(masterPlaylist);
	}

	public void deleteMasterPlaylistById(Long id) {
		this.masterPlaylistRepository.deleteById(id);
	}

	public List<Playlist> findAllPlaylistListOfMasterPlaylist(Long id) {
		List<Long> allIdOfPlaylist = this.masterPlaylistRepository.findPlaylistList(id);
		List<Playlist> allPlaylist = new ArrayList<>();
		for (Long idOfPlaylist : allIdOfPlaylist) {
			allPlaylist.add(this.playlistService.findPlaylistById(idOfPlaylist));
		}
		return allPlaylist;
	}

	public List<Playlist> findPlaylistOfMasterPlaylist(Long id) {
		List<Long> allIdPlaylist = this.masterPlaylistRepository.findPlaylistOfMasterPlaylist(id);
		
		List<Playlist> playlistList = new ArrayList<>();
		if(allIdPlaylist != null && allIdPlaylist.isEmpty() == false) {
			for (Long newId : allIdPlaylist) {
				Playlist playlist = this.playlistService.findPlaylistById(newId);
				playlistList.add(playlist);
			}
		}
		return playlistList;
	}
}
