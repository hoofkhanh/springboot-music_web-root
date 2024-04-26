package com.hokhanh.libary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hokhanh.libary.model.MasterPlaylist;
import com.hokhanh.libary.model.Playlist;

public interface MasterPlaylistRepository extends JpaRepository<MasterPlaylist, Long> {

	@Query(value = "SELECT * FROM master_playlists ORDER BY master_playlist_id", nativeQuery = true)
	List<MasterPlaylist> findAllMasterPlaylistSortId();

	MasterPlaylist findByTitleOfMasterPlaylist(String titleOfMasterPlaylist);

	@Query(value = "SELECT playlist_id FROM master_playlists_playlists WHERE master_playlist_id = ?1", nativeQuery = true)
	List<Long> findPlaylistList(Long id);

	@Query(value = "SELECT master_playlist_id FROM master_playlists_playlists WHERE playlist_id = ?1 ", nativeQuery = true)
	List<Long> findMasterPlaylistByPlayList(Long id);
	
	@Query(value = "SELECT playlist_id FROM master_playlists_playlists WHERE master_playlist_id = ?1 ", nativeQuery = true)
	List<Long> findPlaylistOfMasterPlaylist(Long id);

}
