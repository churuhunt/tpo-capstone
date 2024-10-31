package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.config.NotificationType;
import tpo.capstone.entity.Notification;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserSettings;
import tpo.capstone.repository.BlockRepository;
import tpo.capstone.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private UserAccountService userAccountService;

    @Autowired
    private UserSettingsService userSettingsService;

    public void createNotification(UserAccount user, Post post, NotificationType type, String message) {
        UserAccount postAuthor = post.getAuthor();  // 작성자 정보를 가져옴

        if (isBlocked(user, postAuthor)) return;  // 차단된 사용자면 알림을 생성하지 않음

        UserSettings settings = userSettingsService.getUserSettings(post.getAuthor());
        if ((type == NotificationType.COMMENT && !settings.isAllowCommentNotifications()) ||
                (type == NotificationType.REPLY && !settings.isAllowReplyNotifications())) {
            return;
        }

        Notification notification = new Notification();
        notification.setUser(postAuthor);  // 알림을 받을 사용자 설정
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    public boolean isBlocked(UserAccount blocker, UserAccount blocked) {
        return blockRepository.existsByBlockerAndBlocked(blocker, blocked);
    }

    public List<Notification> getUnreadNotifications(UserAccount user) {
        return notificationRepository.findByUserAndIsReadFalse(user);
    }
}
