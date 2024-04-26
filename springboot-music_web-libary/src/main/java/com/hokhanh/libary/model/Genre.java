package com.hokhanh.libary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "genres")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Genre {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name =  "genre_id")
	private Long id;
	
	private String name;
}
