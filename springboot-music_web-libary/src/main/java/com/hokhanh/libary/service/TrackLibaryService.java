package com.hokhanh.libary.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.TrackLibary;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.PlaylistRepository;
import com.hokhanh.libary.repository.TrackLibaryRepository;
import com.hokhanh.libary.repository.TrackRepository;
import com.hokhanh.libary.repository.UserRepository;

@Service
public class TrackLibaryService {

	@Autowired
	private TrackLibaryRepository trackLibaryRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private TrackRepository trackRepository;
	
	@Autowired
	private PlaylistRepository playlistRepository;
	

	public List<TrackLibary> addToLibary(String trackTitle, String playlistTitle, String artistName,
			Authentication authentication) {
		Track track = this.trackRepository.findByTrackTitle(trackTitle);
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
		User artist = this.userRepository.findByArtistName(artistName);
		
		
		User libaryOwner = this.userRepository.findByEmail(authentication.getName());
		
		if(track != null) {
			Playlist baiHatDaThich = this.playlistRepository.findByPlaylistTitle("Bài hát đã thích của " + libaryOwner.getEmail());
			if(baiHatDaThich == null) {
				baiHatDaThich = new Playlist();
				baiHatDaThich.setPlaylistTitle("Bài hát đã thích của " + libaryOwner.getEmail());
				baiHatDaThich.setDateAdded(LocalDate.now());
				baiHatDaThich.setAlbum(false);
				baiHatDaThich.setNumberOfTracks(1);
				baiHatDaThich.setPrivate(true);
				baiHatDaThich.setUser(libaryOwner);
				
				List<Track> trackList = new  ArrayList<>();
				trackList.add(track);
				baiHatDaThich.setTrackList(trackList);
				
				String imagePath = "D:\\SpringToolSuite\\SpringBoot\\springboot-music_web-root\\springboot-music_web-artist\\src\\main\\resources\\static\\images\\libary\\playlist\\bai-hat-da-thich.png";

		        try {
		            File imageFile = new File(imagePath);
		            FileInputStream fileInputStream = new FileInputStream(imageFile);
		            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

		            byte[] buffer = new byte[1024];
		            int bytesRead;
		            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
		                byteArrayOutputStream.write(buffer, 0, bytesRead);
		            }

		            byte[] imageBytes = byteArrayOutputStream.toByteArray();
		           
		            baiHatDaThich.setImage(Base64.getEncoder().encodeToString(imageBytes));

		            fileInputStream.close();
		            byteArrayOutputStream.close();
		        } catch (IOException e) {
		            e.printStackTrace();
		        }
				
				
				this.playlistRepository.save(baiHatDaThich);
				
				TrackLibary trackLibary = new TrackLibary();
				trackLibary.setLibaryOwner(libaryOwner);
				trackLibary.setTrack(null);
				trackLibary.setPlaylist(baiHatDaThich);
				trackLibary.setUser(null);
				this.trackLibaryRepository.save(trackLibary);
				return this.trackLibaryRepository.findByLibaryOwner(libaryOwner.getId());
			}else {
				List<Long> idTrackList = this.playlistRepository.findTrackListByPlaylistId(baiHatDaThich.getId());
				List<Track> trackList = new ArrayList<>();
				for (Long id : idTrackList) {
					Track trackTemp = this.trackRepository.findById(id).get();
					trackList.add(trackTemp);
				}
				
				trackList.add(track);
				
				baiHatDaThich.setTrackList(trackList);
				baiHatDaThich.setNumberOfTracks(baiHatDaThich.getNumberOfTracks() + 1);
				this.playlistRepository.save(baiHatDaThich);
				return this.trackLibaryRepository.findByLibaryOwner(libaryOwner.getId());
			}	
		}
		
		TrackLibary trackLibary = new TrackLibary();
		trackLibary.setLibaryOwner(libaryOwner);
		trackLibary.setTrack(track);
		trackLibary.setPlaylist(playlist);
		trackLibary.setUser(artist);
		
		this.trackLibaryRepository.save(trackLibary);
		
		return this.trackLibaryRepository.findByLibaryOwner(libaryOwner.getId());
	}


	public List<TrackLibary> findByUser(Authentication authentication) {
		Playlist allLikedTrack = this.playlistRepository.findByPlaylistTitle("Bài hát đã thích của " + authentication.getName());
		if(allLikedTrack != null) {
			int count =0;
			if(allLikedTrack.getTrackList() != null && allLikedTrack.getTrackList().isEmpty() == false) {
				for (Track track : allLikedTrack.getTrackList()) {
					count ++;
				}
			}
			
			allLikedTrack.setNumberOfTracks(count);
			this.playlistRepository.save(allLikedTrack);
		}
		return this.trackLibaryRepository.findByLibaryOwner(this.userRepository.findByEmail(authentication.getName()).getId());
	}

	public Playlist findAllLikedTrack(Authentication authentication) {
		User artist = this.userRepository.findByEmail(authentication.getName());
		return this.playlistRepository.findByPlaylistTitle("Bài hát đã thích của " + artist.getEmail());
		
//		Khi thứ tự track bị lẫn lộn thì sẽ dùng cái này set trackList cho Playlist
//		List<Long> allIdOfTrack = this.playlistRepository.findTrackListByPlaylistId(id);
//		List<Track> allTrack = new ArrayList<>();
//		for (Long idOfTrack : allIdOfTrack) {
//			allTrack.add(this.trackService.findTrackById(idOfTrack));
//		}
	}


	public List<TrackLibary> deleteToLibary(String trackTitle, String playlistTitle, String artistName,
			Authentication authentication) {
		Track track = this.trackRepository.findByTrackTitle(trackTitle);
		Playlist playlist = this.playlistRepository.findByPlaylistTitle(playlistTitle);
		User artist = this.userRepository.findByArtistName(artistName);
		
		
		User libaryOwner = this.userRepository.findByEmail(authentication.getName());
		
		if(track != null) {
			Playlist baiHatDaThich = this.playlistRepository.findByPlaylistTitle("Bài hát đã thích của " + libaryOwner.getEmail());
			if(baiHatDaThich != null) {
				if(baiHatDaThich.getTrackList() != null && baiHatDaThich.getTrackList().isEmpty() == false) {
					List<Long> idTrackList = this.playlistRepository.findTrackListByPlaylistId(baiHatDaThich.getId());
					List<Track> trackList = new ArrayList<>();
					for (Long id : idTrackList) {
						Track trackTemp = this.trackRepository.findById(id).get();
						if(trackTemp.getId() != track.getId()) {
							trackList.add(trackTemp);
						}
					}
					
					trackList.remove(track);
					
					baiHatDaThich.setNumberOfTracks(baiHatDaThich.getNumberOfTracks() -1);
					baiHatDaThich.setTrackList(trackList);
					this.playlistRepository.save(baiHatDaThich);
				}
			}
		}
		
		if(playlist != null) {
			TrackLibary trackLibary = this.trackLibaryRepository.findByPlaylistAndLibaryOwner(playlist, libaryOwner);
			if(trackLibary != null) {
				this.trackLibaryRepository.deleteById(trackLibary.getId());
			}
		}
		
		if(artist != null) {
			TrackLibary trackLibary = this.trackLibaryRepository.findByUserAndLibaryOwner(artist, libaryOwner);
			if(trackLibary != null) {
				this.trackLibaryRepository.deleteById(trackLibary.getId());
			}
		}
				
		
		return this.trackLibaryRepository.findByLibaryOwner(libaryOwner.getId());
	}
}
