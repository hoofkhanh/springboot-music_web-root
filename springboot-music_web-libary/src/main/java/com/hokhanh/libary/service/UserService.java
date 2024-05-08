package com.hokhanh.libary.service;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hokhanh.libary.model.Playlist;
import com.hokhanh.libary.model.Role;
import com.hokhanh.libary.model.Track;
import com.hokhanh.libary.model.User;
import com.hokhanh.libary.repository.OtpRepository;
import com.hokhanh.libary.repository.PlaylistRepository;
import com.hokhanh.libary.repository.RoleRepository;
import com.hokhanh.libary.repository.TrackRepository;
import com.hokhanh.libary.repository.UserRepository;
import com.hokhanh.libary.model.OTP;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import net.bytebuddy.utility.RandomString;


@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PlaylistRepository playlistRepository;

	@Autowired
	private TrackRepository trackRepository;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired 
	private JavaMailSender mailSender;
	
	@Autowired
	private OtpRepository otpRepository;
	
	public String findByEmailForAllRole(String email) {
		User artist = this.userRepository.findByEmail(email);
		if(artist != null && artist.getRole().getName().equals("ADMIN")) {
			return "ADMIN";
		}else if(artist != null && (artist.getRole().getName().equals("ARTIST") || artist.getRole().getName().equals("ARTIST_NEXT_GEN"))) {
			return "ARTIST";
		}else {
			return null;
		}
	}
    

	public User findUserByEmail(String email) {
		User artist = this.userRepository.findByEmail(email);
		if (artist != null && (artist.getRole().getName().equals("ARTIST") || artist.getRole().getName().equals("ARTIST_NEXT_GEN"))) {
			return artist;
		} else {
			return null;
		}
	}

	public List<User> findAllFollowEachOtherList(String email) {
//		chô này fix lại là hiện những ng đang follow qua lại vs nhau
		User user = this.userRepository.findByEmail(email);
		List<User> userList = new ArrayList<>();
		if(user.getFollowingList() != null && user.getFollowingList().isEmpty() == false) {
			for (Long id : user.getFollowingList()) {
				User userTemp = this.userRepository.findById(id).get();
				if (userTemp.getRole().getName().equals("ARTIST") || userTemp.getRole().getName().equals("ARTIST_NEXT_GEN")) {
					userList.add(userTemp);
				}
			}
		}
		
		List<User> newUserList = new ArrayList<>();
		if(userList != null && userList.isEmpty() == false && user.getFollowerList() != null && user.getFollowerList().isEmpty()== false) {
			for (Long userFollower : user.getFollowerList()) {
				for (User userFollowing : userList) {
					User userTemp = this.userRepository.findById(userFollower).get();
					if(userFollower == userFollowing.getId()) {
						newUserList.add(userTemp);
					}
				}
			}
		}
		
		return newUserList;
	}

	public User changeAvatarOfArtist(MultipartFile avatarOfArtist, String artistName) throws IOException {
		User artist = this.userRepository.findByArtistName(artistName);
		if (avatarOfArtist.isEmpty() == false) {
			artist.setImage(Base64.getEncoder().encodeToString(avatarOfArtist.getBytes()));
			return this.userRepository.save(artist);
		}

		return null;
	}

	public List<User> findByArtistNameInSearch(String artistName) {
		return this.userRepository.findByArtistNameInSearch(artistName);
	}

	public List<Playlist> findAllPlaylistByPlaylistTitleInSearch(String playlistTitle) {
		return this.playlistRepository.findAllPlaylistByPlaylistTitleInSearch(playlistTitle);
	}

	public List<Track> findAllTrackByTrackTitleInSearch(String trackTitle) {
		return this.trackRepository.findAllTrackByTrackTitleInSearch(trackTitle);
	}

	public List<User> findTop15FollowingOfArtist(String artistName) {
		User artist = this.userRepository.findByArtistName(artistName);
		List<Object[]> allIdFollowingArtistTemp = this.userRepository.findTop15FollowingOfArtist(artist.getId());
		List<User> allFollowingArtist = new ArrayList<>();
		int count =0;
		for (Object[] row : allIdFollowingArtistTemp) {
			if(row != null) {
				for (Object obj : row) {
					Long followingId = (Long) obj;
					if(count <15) {
						allFollowingArtist.add(this.userRepository.findById(followingId).get());
					}
					
					count ++;
			    }
			}
		}	

		return allFollowingArtist;
	}

	public User conductFollowArtist(String artistName, String email) {
		User artist = this.userRepository.findByEmail(email);
		User followed = this.userRepository.findByArtistName(artistName);

		if(followed.getFollowerList() == null) {
			followed.setFollowerList(new ArrayList<>());
		}
		followed.getFollowerList().add(artist.getId());
		
		if(artist.getFollowingList() == null) {
			artist.setFollowingList(new ArrayList<>());
		}
		artist.getFollowingList().add(followed.getId());
		
		this.userRepository.save(artist);
		return this.userRepository.save(followed);
	}

	public User cancelFollowArtist(String artistName, String email) {
		User artist = this.userRepository.findByEmail(email);

		User followed = this.userRepository.findByArtistName(artistName);
		
		Iterator<Long> followingList = artist.getFollowingList().iterator();
		while(followingList.hasNext()) {
			User artistTemp = this.userRepository.findById(followingList.next()).get();
			if (artistTemp.getArtistName().equals(artistName)) {
				followingList.remove();
			}
		}

		Iterator<Long> followerList = followed.getFollowerList().iterator();
		while(followerList.hasNext()) {
			User artistTemp = this.userRepository.findById(followerList.next()).get();
			if (artistTemp.getArtistName().equals(artist.getArtistName())) {
				followerList.remove();
			}
		}
	
		this.userRepository.save(artist);
		return this.userRepository.save(followed);
	}

	public User findById(Long id) {
		return this.userRepository.findById(id).get();
	}

	public String buyPackgeOfTurnOffAd(Authentication authentication) {
		Role role = this.roleRepository.findByName("ARTIST_NEXT_GEN");
		User artist = this.userRepository.findByEmail(authentication.getName());
		artist.setRole(role);
		this.userRepository.save(artist);
		return "Mua thành công";
	}
	
	public int totalTrack(String artistName) {
		User artist = this.userRepository.findByArtistName(artistName);
		return this.trackRepository.totalTrack(artist.getId());
	}

	
//	Mail dki, quen mat khau

     
	public void sendOTPEmail(String email, String chucNang)
	        throws UnsupportedEncodingException, MessagingException {
		String OTP = RandomString.make(8);
		OTP otp = this.otpRepository.findByEmailAndChucNang(email, chucNang);
		if(otp == null) {
			otp = new OTP();
			otp.setEmail(email);
			otp.setOtp(OTP);
			otp.setExpireTime(LocalDateTime.now().plusMinutes(1));
			otp.setChucNang(chucNang);
		}else {
			otp.setOtp(OTP);
			otp.setExpireTime(LocalDateTime.now().plusMinutes(1));
		}
		
		this.otpRepository.save(otp);
		
		
	    MimeMessage message = mailSender.createMimeMessage();              
	    MimeMessageHelper helper = new MimeMessageHelper(message);
	     
	    helper.setFrom("hotuankhanh20112016@gmail.com", "Hỗ trợ kĩ thuật");
	    helper.setTo(email);
	     
	    String subject = "Đây là mã OTP của bạn và sẽ hết hạn sau 1 phút!";
	     
	    String content = "<p>Hello "+ email + "</p>"
	            + "<p><b>" + OTP + "</b></p>"
	            + "<br>"
	            + "<p>Lưu ý: mã OTP này chỉ có hiệu lực trong vòng 1 phút.</p>";
	     
	    helper.setSubject(subject);
	     
	    helper.setText(content, true);
	     
	    mailSender.send(message);      
	}

	public String confirmForgetPassword(String email, String password, String Otp) {
		User user = this.userRepository.findByEmail(email);
		if( user == null) {
			OTP deleteOtp = this.otpRepository.findByEmailAndChucNang(email, "Quên mật khẩu");
			if(deleteOtp != null) {
				this.otpRepository.delete(deleteOtp);
			}
			return "Email sai";
		}else {
			if(user.getRole().getName().equals("ADMIN")) {
				return "Email sai";
			}
		}
		
		OTP otpFromDatabase = this.otpRepository.findByEmailAndChucNang(email, "Quên mật khẩu");
		if(otpFromDatabase == null) {
			return "Bạn chưa gửi mã OTP";
		}else {
			if(otpFromDatabase.getOtp().equals(Otp) == false) {
				return "Sai mã OTP";
			}
				
			LocalDateTime currentTime = LocalDateTime.now();
			LocalDateTime expireTime = otpFromDatabase.getExpireTime();
			
			boolean isCurrentTimeAfterExpireTime = currentTime.isAfter(expireTime);
			if(isCurrentTimeAfterExpireTime) {
				return "Mã OTP đã hết hạn";
			}else {
				user.setPassword(bCryptPasswordEncoder.encode(password));
				this.userRepository.save(user);
				this.otpRepository.deleteById(otpFromDatabase.getId());
				return "Thành công";
			}
		}
	}

	public String confirmRegister(User user, String Otp) throws IOException {
		if(this.userRepository.findByEmail(user.getEmail()) != null) {
			OTP otpDelete = this.otpRepository.findByEmailAndChucNang(user.getEmail(), "Đăng kí");
			if(otpDelete != null) {
				this.otpRepository.delete(otpDelete);
			}
			return "Email đã được đăng kí";
		}
		
		if(this.userRepository.findByArtistName(user.getArtistName()) != null) {
			return "Tên nghệ danh này đã được đăng kí";
		}
		
		OTP otpFromDatabase = this.otpRepository.findByEmailAndChucNang(user.getEmail(), "Đăng kí");
		if(otpFromDatabase == null) {
			return "Bạn chưa gửi mã OTP";
		}else {
			if(otpFromDatabase.getOtp().equals(Otp) == false) {
				return "Sai mã OTP";
			}
				
			LocalDateTime currentTime = LocalDateTime.now();
			LocalDateTime expireTime = otpFromDatabase.getExpireTime();
			
			boolean isCurrentTimeAfterExpireTime = currentTime.isAfter(expireTime);
			if(isCurrentTimeAfterExpireTime) {
				return "Mã OTP đã hết hạn";
			}else {
				String imagePath = "D:\\SpringToolSuite\\SpringBoot\\springboot-music_web-root\\springboot-music_web-artist\\src\\main\\resources\\static\\images\\hinhmacdinh.jpg";
				File file = new File(imagePath);
				byte[] fileContent = Files.readAllBytes(file.toPath());
				user.setImage(Base64.getEncoder().encodeToString(fileContent));

				
				user.setRole(this.roleRepository.findByName("ARTIST"));
				user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
				this.userRepository.save(user);
				this.otpRepository.deleteById(otpFromDatabase.getId());
				return "Thành công";
			}
		}
		
	}
 
	public String conductChange(String email, String oldPassword, String newPassword) {
		User user = this.userRepository.findByEmail(email);
		if(user == null) {
			return "Email sai";
		}else {
			if(user.getRole().getName().equals("ADMIN")) {
				return "Email sai";
			}
		}
		
		if(bCryptPasswordEncoder.matches(oldPassword, user.getPassword())){
			if(oldPassword.equals(newPassword)) {
				return "Mật khẩu cũ và mới không thể giống nhau";
			}
			
			user.setPassword(bCryptPasswordEncoder.encode(newPassword));
			this.userRepository.save(user);
			return "Thành công";
		}else {
			return "Sai mật khẩu cũ";
		}
		
		
	}

	public List<User> findAllFollowingArtist(String artistName) {
		User artist = this.userRepository.findByArtistName(artistName);
		
		List<User> followingArtist = new ArrayList<>();
		
		List<Long> followingArtistId = artist.getFollowingList();
		if(followingArtistId != null && followingArtistId.isEmpty() == false) {
			for (Long id : followingArtistId) {
				followingArtist.add(this.userRepository.findById(id).get());
			}
		}
		
		return followingArtist;
	}
	
	public List<User> findAllFollowerArtist(String artistName) {
		User artist = this.userRepository.findByArtistName(artistName);
		
		List<User> followerArtist = new ArrayList<>();
		
		List<Long> followerArtistId = artist.getFollowerList();
		if(followerArtistId != null && followerArtistId.isEmpty() == false) {
			for (Long id : followerArtistId) {
				followerArtist.add(this.userRepository.findById(id).get());
			}
		}
		
		return followerArtist;
	}

	public String changeProfile(User user) {
		User checkArtistName = this.userRepository.findByArtistName(user.getArtistName());
		if( checkArtistName != null && checkArtistName.getId() != user.getId() ) {
			return "Đã tồn tại nghệ danh này rồi";
		}
		
		this.userRepository.save(user);
		return "Thành công";
	}

	


}
