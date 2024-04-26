package com.hokhanh.libary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.SearchHistory;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;

import jakarta.transaction.Transactional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

	@Query(value = "SELECT * FROM search_histories WHERE searcher_id = ?1 ORDER BY search_history_id DESC", nativeQuery = true)
	List<SearchHistory> findBySearcher(Long idSearcher);
	
	@Transactional
	@Modifying
	void deleteAllByTrack(Track track);
	
	@Transactional
    @Modifying
	void deleteAllByPlaylist(Playlist playlist);

	SearchHistory findBySearcherAndUser(User searcher, User user);

	SearchHistory findBySearcherAndPlaylist(User searcher, Playlist playlist);

	SearchHistory findBySearcherAndTrack(User searcher, Track track);
}
