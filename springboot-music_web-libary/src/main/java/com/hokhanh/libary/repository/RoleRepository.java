package com.hokhanh.libary.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hokhanh.libary.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

	Role findByName(String name);
}
