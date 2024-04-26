package com.hokhanh.libary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	User findByEmail(String email);
	
	User findByArtistName(String artistName);
	
	@Query(value =  "SELECT * FROM users WHERE LOWER(artist_name) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
	List<User> findByArtistNameInSearch(String artistName);

	@Query(value =  "SELECT following_list FROM users WHERE user_id = ?1", nativeQuery = true)
	List<Object[]> findTop15FollowingOfArtist(Long user_id);
	

}
