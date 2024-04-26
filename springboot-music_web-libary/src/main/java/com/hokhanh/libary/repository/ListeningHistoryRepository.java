package com.hokhanh.libary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hokhanh.libary.model.ListeningHistory;
import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;

import jakarta.transaction.Transactional;

public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, Long> {

	@Query(value = "SELECT * FROM listening_histories WHERE listener_id = ?1 ORDER BY listening_history_id DESC", nativeQuery = true)
	List<ListeningHistory> findByListener(Long idListener);
	
	ListeningHistory findByListenerAndTrack(User listener, Track track);
	
	ListeningHistory findByListenerAndPlaylist(User listener, Playlist playlist);

	ListeningHistory findByListenerAndUser(User listener, User user);
	
	@Transactional
    @Modifying
	void deleteAllByTrack(Track track);
	
	@Transactional
    @Modifying
	void deleteAllByPlaylist(Playlist playlist);

}
