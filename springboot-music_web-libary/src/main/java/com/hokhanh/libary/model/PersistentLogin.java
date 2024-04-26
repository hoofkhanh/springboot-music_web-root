package com.hokhanh.libary.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "persistent_logins")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PersistentLogin {

	private String username;
	
	@Id
	private String series;
	private String token;
	private LocalDate last_used;
}
