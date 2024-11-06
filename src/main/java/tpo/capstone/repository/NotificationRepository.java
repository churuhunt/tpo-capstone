package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.Notification;
import tpo.capstone.entity.UserAccount;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 읽지 않은 알림 조회
    List<Notification> findByUserAndIsReadFalse(UserAccount user);

    // 모든 알림 조회
    List<Notification> findByUser(UserAccount user);

    // 읽은 알림만 조회
    List<Notification> findByUserAndIsReadTrue(UserAccount user);
}