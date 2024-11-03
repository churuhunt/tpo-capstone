package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final BlockRepository blockRepository;
    private final UserAccountService userAccountService;
    private final UserSettingsService userSettingsService;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, BlockRepository blockRepository,
                               UserAccountService userAccountService, UserSettingsService userSettingsService) {
        this.notificationRepository = notificationRepository;
        this.blockRepository = blockRepository;
        this.userAccountService = userAccountService;
        this.userSettingsService = userSettingsService;
    }

    /**
     * 알림 생성 메서드.
     * @param user 알림을 보내는 사용자
     * @param post 대상 게시물
     * @param type 알림 유형 (댓글, 대댓글 등)
     * @param message 알림 메시지
     */
    public void createNotification(UserAccount user, Post post, NotificationType type, String message) {
        UserAccount postAuthor = post.getAuthor();  // 게시물 작성자

        // 작성자가 차단된 경우 알림을 생성하지 않음
        if (isBlocked(user, postAuthor)) {
            log.info("알림을 생성하지 않음 - 작성자가 차단된 상태입니다.");
            return;
        }

        // 사용자 설정에 따라 알림 허용 여부 확인
        UserSettings settings = userSettingsService.getUserSettings(postAuthor);
        if (!isNotificationAllowed(type, settings)) {
            log.info("알림이 설정에 의해 허용되지 않음 - 유형: {}", type);
            return;
        }

        // 알림 생성 및 저장
        Notification notification = new Notification();
        notification.setUser(postAuthor);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
        log.info("알림 생성 완료 - 사용자 ID: {}, 메시지: {}", postAuthor.getId(), message);
    }

    /**
     * 차단 여부 확인 메서드.
     * @param blocker 차단한 사용자
     * @param blocked 차단된 사용자
     * @return 차단 여부
     */
    public boolean isBlocked(UserAccount blocker, UserAccount blocked) {
        boolean isBlocked = blockRepository.existsByBlockerAndBlocked(blocker, blocked);
        log.debug("차단 여부 확인 - 차단자 ID: {}, 차단된 사용자 ID: {}, 결과: {}", blocker.getId(), blocked.getId(), isBlocked);
        return isBlocked;
    }

    /**
     * 알림 허용 여부를 설정에 따라 확인.
     * @param type 알림 유형
     * @param settings 사용자 설정
     * @return 허용 여부
     */
    private boolean isNotificationAllowed(NotificationType type, UserSettings settings) {
        return (type == NotificationType.COMMENT && settings.isAllowCommentNotifications()) ||
                (type == NotificationType.REPLY && settings.isAllowReplyNotifications());
    }

    /**
     * 읽지 않은 알림 목록을 가져옴.
     * @param user 대상 사용자
     * @return 읽지 않은 알림 리스트
     */
    public List<Notification> getUnreadNotifications(UserAccount user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalse(user);
        log.info("읽지 않은 알림 조회 - 사용자 ID: {}, 알림 수: {}", user.getId(), unreadNotifications.size());
        return unreadNotifications;
    }
}
