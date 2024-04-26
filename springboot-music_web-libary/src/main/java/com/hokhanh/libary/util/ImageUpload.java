package com.hokhanh.libary.util;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ImageUpload {

	private final String UPLOAD_FOLDER_FILE_OF_TRACK = "D:\\SpringToolSuite\\SpringBoot\\springboot-music_web-root\\springboot-music_web-artist\\src\\main\\resources\\static\\file-of-track";
	
	public void uploadFileOfTrack(MultipartFile image) {
		try {
			Files.copy(image.getInputStream(), Paths.get(UPLOAD_FOLDER_FILE_OF_TRACK + File.separator, image.getOriginalFilename()),
					StandardCopyOption.REPLACE_EXISTING);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
