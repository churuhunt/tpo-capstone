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

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserAccount user;

    private boolean allowCommentNotifications = true;
    private boolean allowReplyNotifications = true;

    private LocalDateTime nicknameLastChanged = LocalDateTime.now();
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