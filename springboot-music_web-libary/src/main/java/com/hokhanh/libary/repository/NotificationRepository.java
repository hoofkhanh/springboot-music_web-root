package com.hokhanh.libary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hokhanh.libary.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	@Query(value = "SELECT * FROM notifications ORDER BY notification_id LIMIT 1", nativeQuery = true)
	Notification findFirstNoti();
}
