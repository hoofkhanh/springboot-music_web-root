package com.hokhanh.libary.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "master_playlists")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MasterPlaylist {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name =  "master_playlist_id")
	private Long id;
	
	private String titleOfMasterPlaylist;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "user_id")
	private User user;
	
	@ManyToMany
	@JoinTable(name = "master_playlists_playlists", joinColumns = @JoinColumn(name = "master_playlist_id", referencedColumnName = "master_playlist_id"),
			inverseJoinColumns = @JoinColumn(name = "playlist_id", referencedColumnName = "playlist_id"))
	private List<Playlist> playlistList;

}
