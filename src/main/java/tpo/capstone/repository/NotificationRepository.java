package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.Notification;
import tpo.capstone.entity.UserAccount;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserAndIsReadFalse(UserAccount user);
}
