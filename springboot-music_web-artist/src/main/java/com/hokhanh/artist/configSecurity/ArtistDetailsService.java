package com.hokhanh.artist.configSecurity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hokhanh.libary.model.User;
import com.hokhanh.libary.service.AdminService;
import com.hokhanh.libary.service.UserService;

@Service
public class ArtistDetailsService implements UserDetailsService{
	
	@Autowired
	private UserService userService;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User artist = this.userService.findUserByEmail(username);
		if(artist == null) {
			throw new UsernameNotFoundException("Could not find "+username);
		}
		
		return new ArtistDetails(artist);
	}

}
