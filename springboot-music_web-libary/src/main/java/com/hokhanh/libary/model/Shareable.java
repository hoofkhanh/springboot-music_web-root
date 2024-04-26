package com.hokhanh.libary.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "shareables")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Shareable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name =  "shareable_id")
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "track_id", referencedColumnName = "track_id")
	private Track track;
	
	@ManyToOne
	@JoinColumn(name = "playlist_id", referencedColumnName = "playlist_id")
	private Playlist playlist;
	
	@ManyToOne
	@JoinColumn(name = "sharers_id", referencedColumnName = "user_id")
	private User sharers;
	
	private LocalDate shareDate;
	
	private String shareMessage;

}
