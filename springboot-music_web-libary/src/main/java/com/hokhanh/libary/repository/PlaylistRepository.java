package com.hokhanh.libary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

	@Query( value = "SELECT * FROM playlists WHERE playlist_title = ?1", nativeQuery = true)
	Playlist findByPlaylistTitle(String playlistTitle);
	
	@Query( value = "SELECT track_id FROM playlists_tracks WHERE playlist_id = ?1", nativeQuery = true)
	List<Long> findAllTrackOfPlaylist(Long playlistId);
	
	@Query( value = "SELECT * FROM playlists ORDER BY playlist_id", nativeQuery = true)
	List<Playlist> findAllPlaylistSortId();
	
	List<Playlist> findByUser(User user);
	
	@Query( value = "SELECT * FROM playlists WHERE user_id = ?1 ORDER BY playlist_id", nativeQuery = true)
	List<Playlist> findByUserSortId(Long userId);

	@Query( value = "SELECT track_id FROM playlists_tracks WHERE playlist_id = ?1", nativeQuery = true)
	List<Long> findTrackListByPlaylistId(Long id);
	
	@Query(value = "SELECT playlist_id FROM playlists_tracks WHERE track_id = ?1 ", nativeQuery = true)
	List<Long> findPlaylistByTrack(Long trackId);

	@Query(value =  "SELECT * FROM playlists WHERE LOWER(playlist_title) LIKE LOWER(CONCAT('%', ?1, '%')) AND is_private = false", nativeQuery = true)
	List<Playlist> findAllPlaylistByPlaylistTitleInSearch(String playlistTitle);
}
