package com.hokhanh.libary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Shareable;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.TrackLibary;
import com.hokhanh.libary.model.User;

import jakarta.transaction.Transactional;

public interface TrackLibaryRepository extends JpaRepository<TrackLibary, Long> {

	@Query(value = "SELECT * FROM track_libaries WHERE libary_owner_id = ?1 ORDER BY track_libaries DESC", nativeQuery = true)
	List<TrackLibary> findByLibaryOwner(Long IdLibaryOwner);
	
	List<TrackLibary> findByPlaylist(Playlist playlist);
	
	TrackLibary findByPlaylistAndLibaryOwner(Playlist playlist, User libaryOwner);
	
	TrackLibary findByUserAndLibaryOwner(User artist, User libaryOwner);
	
	@Transactional
	@Modifying
	void deleteAllByTrack(Track track);
	
	@Transactional
    @Modifying
	void deleteAllByPlaylist(Playlist playlist);

	
}
