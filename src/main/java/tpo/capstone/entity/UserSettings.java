package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false) // 지연 로딩 적용 및 user 필드 필수 값 설정
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Column(nullable = false)
    private boolean allowCommentNotifications = true;

    @Column(nullable = false)
    private boolean allowReplyNotifications = true;

    @Column(nullable = false)
    private LocalDateTime nicknameLastChanged = LocalDateTime.now();

    @Column(nullable = false)
    private boolean emailChanged = false;

    // 특정 필드를 초기화하는 생성자
    public UserSettings(UserAccount user) {
        this.user = user;
        this.allowCommentNotifications = true;
        this.allowReplyNotifications = true;
        this.nicknameLastChanged = LocalDateTime.now();
        this.emailChanged = false;
    }

    // 모든 필드를 초기화하는 생성자
    public UserSettings(UserAccount user, boolean allowCommentNotifications, boolean allowReplyNotifications) {
        this.user = user;
        this.allowCommentNotifications = allowCommentNotifications;
        this.allowReplyNotifications = allowReplyNotifications;
        this.nicknameLastChanged = LocalDateTime.now();
        this.emailChanged = false;
    }
}