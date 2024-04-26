package com.hokhanh.libary.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
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
@Table(name = "tracks")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Track {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name =  "track_id")
	private Long id;
	
	private String trackTitle;
	
	@Column(columnDefinition = "text")
	private String trackFile;
	private double trackDuration;
	private LocalDate releaseDate;
	private long numberOfListens;
	
	@Column(columnDefinition = "text")
	private String lyrics;
	@Column(columnDefinition = "text")
	private String image;
	private boolean isPrivate;
	
	@ManyToOne
	@JoinColumn(name = "genre_id", referencedColumnName = "genre_id")
	private Genre genre;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "user_id")
	private User user;
	
	@ManyToMany
	@JoinTable(name = "cooperators", joinColumns = @JoinColumn(name = "track_id", referencedColumnName = "track_id"),
			inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "user_id"))
	private List<User> userList;
}
