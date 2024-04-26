package com.hokhanh.libary.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hokhanh.libary.model.Genre;

public interface GenreRepository extends JpaRepository<Genre, Long>  {

}
