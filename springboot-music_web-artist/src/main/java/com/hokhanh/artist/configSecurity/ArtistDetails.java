package com.hokhanh.artist.configSecurity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hokhanh.libary.model.User;

public class ArtistDetails implements UserDetails{
	private static final long serialVersionUID = 1L;
	
	private User artist;

	public ArtistDetails(User artist) {
		this.artist = artist;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
		grantedAuthorities.add(new SimpleGrantedAuthority(this.artist.getRole().getName()));
		return grantedAuthorities;
	}

	@Override
	public String getPassword() {
		return artist.getPassword();
	}

	@Override
	public String getUsername() {
		return artist.getEmail();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
