package com.hokhanh.libary.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hokhanh.libary.model.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {

}
