package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import tpo.capstone.config.NotificationType;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private UserAccount user;  // 알림을 받을 사용자

    private String message;     // 알림 메시지
    private boolean isRead;     // 읽음 여부
    private NotificationType type;  // 알림 유형

    @ManyToOne
    private Post post;          // 관련된 게시글 (댓글/대댓글)

    private LocalDateTime timestamp; // 알림 생성 시간
}