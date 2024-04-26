package com.hokhanh.libary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hokhanh.libary.model.Genre;
import com.hokhanh.libary.repository.GenreRepository;

@Service
public class GenreService {

	@Autowired
	private GenreRepository genreRepository;
	
	public List<Genre> findAllGenre(){
		return this.genreRepository.findAll();
	}
}
