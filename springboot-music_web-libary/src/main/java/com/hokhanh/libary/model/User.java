package com.hokhanh.libary.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data	
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	@Column(unique = true)
	private String email;
	private String password;
	private String firstName;
	private String lastName;
	
	@Column(unique = true)
	private String artistName;
	private String gender;
	private LocalDate dayOfBirth;
	
	@Column(columnDefinition = "text")
	private String image;

	@ManyToOne
	@JoinColumn(name = "role_id", referencedColumnName = "role_id")
	private Role role;

	@ManyToOne
	@JoinColumn(name = "country_id", referencedColumnName = "country_id")
	private Country country;
	
	List<Long> followerList;
	
	List<Long> followingList ;

	
}
