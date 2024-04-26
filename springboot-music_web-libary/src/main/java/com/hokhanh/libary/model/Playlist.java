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
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "playlists")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Playlist {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name =  "playlist_id")
	private Long id;
	
	private String playlistTitle;
	private String totalTime;
	private int numberOfTracks;
	@Column(columnDefinition = "text")
	private String image;
	private LocalDate dateAdded;
	private boolean isPrivate;
	private boolean isAlbum;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "user_id")
	private User user;
	
	@ManyToMany
	@JoinTable(name = "playlists_tracks", joinColumns = @JoinColumn(name = "playlist_id", referencedColumnName = "playlist_id"),
			inverseJoinColumns = @JoinColumn(name = "track_id", referencedColumnName = "track_id"))
	private List<Track> trackList;
}
