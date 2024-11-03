package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 적용
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;  // 마이홈의 주인

    @Column(nullable = false)
    private String visitorUsername;  // 방문자의 이름 또는 ID

    @Column(nullable = false)
    private LocalDateTime visitTime; // 방문 시간

    // 기본 생성자
    public Visitor() {}

    // 필드 값을 초기화하는 생성자
    public Visitor(UserAccount user, String visitorUsername) {
        this.user = user;
        this.visitorUsername = visitorUsername;
        this.visitTime = LocalDateTime.now();
    }
}
