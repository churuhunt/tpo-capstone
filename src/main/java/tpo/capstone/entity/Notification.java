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

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩을 사용하여 성능 최적화
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;  // 알림을 받을 사용자

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩을 사용하여 성능 최적화
    @JoinColumn(name = "post_id")
    private Post post;  // 관련된 게시글 (댓글/대댓글 등 알림의 출처)

    private String message; // 알림 메시지
    private boolean isRead = false; // 읽음 여부, 기본값 false

    @Enumerated(EnumType.STRING) // Enum 값을 문자열로 저장
    private NotificationType type; // 알림 유형 (예: 댓글, 대댓글, 좋아요 등)

    private LocalDateTime timestamp; // 알림 생성 시간

    // 기본 생성자
    public Notification() {
        this.timestamp = LocalDateTime.now(); // 생성 시점으로 초기화
    }
}