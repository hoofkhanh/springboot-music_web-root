package com.hokhanh.libary.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hokhanh.libary.model.Genre;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;

import jakarta.transaction.Transactional;

public interface TrackRepository extends JpaRepository<Track, Long> {

	Track findByTrackTitle(String trackTitle);
	
	@Query(value = "SELECT * FROM tracks ORDER BY track_id", nativeQuery = true)
	List<Track> findAllTrackSortId();
	
	@Query(value = "SELECT * FROM tracks WHERE user_id = ?1 ORDER BY track_id", nativeQuery = true)
	List<Track> findByUser(Long user_id);

	@Query(value = "SELECT * FROM tracks WHERE genre_id = :genreId", nativeQuery = true)
	List<Track> findByGenre(@Param("genreId") Long genre_id);
	
	@Query(value = "DELETE FROM playlists_tracks WHERE track_id = ?1", nativeQuery = true)
	void deleteTrackInPlaylist(Long trackId);
	
	List<Track> findByIdNotIn(Collection<Long> ids);
	
	@Query(value = "SELECT * FROM tracks WHERE user_id = ?1 AND is_private = FALSE ORDER BY number_of_listens DESC LIMIT 10", nativeQuery = true)
	List<Track> findAllTrackByArtistName(Long userId);
	
	@Query(value = "SELECT * FROM tracks WHERE user_id = ?1 AND is_private = FALSE ORDER BY track_id", nativeQuery = true)
	List<Track> findAllTrackByArtistNameInSeeAll(Long userId);
	

	@Query(value = "SELECT * FROM tracks WHERE LOWER(track_title) LIKE LOWER(CONCAT('%', ?1, '%')) AND is_private = FALSE", nativeQuery = true)
	List<Track> findAllTrackByTrackTitleInSearch(String trackTitle);
	
	@Query(value =  "SELECT COUNT(*) FROM tracks WHERE user_id = ?1 AND is_private = FALSE", nativeQuery = true)
	int totalTrack(Long userId);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE tracks SET number_of_listens = number_of_listens + 1 WHERE track_title = ?1", nativeQuery = true)
	void increaseNumberOfListenByTrackTitle(String trackTitle);

}
