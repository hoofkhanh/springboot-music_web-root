package com.hokhanh.libary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.SearchHistory;
import com.hokhanh.libary.model.Shareable;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;

import jakarta.transaction.Transactional;

public interface ShareableRepository extends JpaRepository<Shareable, Long> {

	@Query(value = "SELECT * FROM shareables WHERE sharers_id = ?1 ORDER BY shareable_id DESC", nativeQuery = true)
	List<Shareable> findBySharer(Long idSharer);
	
	@Query(value = "SELECT * FROM shareables WHERE sharers_id = ?1 AND track_id = ?2 ORDER BY shareable_id DESC", nativeQuery = true)
	List<Shareable> findBySharersAndTrack(Long sharersId, Long trackId);
	
	@Query(value = "SELECT * FROM shareables WHERE sharers_id = ?1 AND playlist_id = ?2 ORDER BY shareable_id DESC", nativeQuery = true)
	List<Shareable> findBySharersAndPlaylist(Long sharersId, Long playlistId);
	
	@Transactional
	@Modifying
	void deleteAllByTrack(Track track);
	
	@Transactional
    @Modifying
	void deleteAllByPlaylist(Playlist playlist);
}
