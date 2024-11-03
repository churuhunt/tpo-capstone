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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserAccount user;  // 마이홈의 주인

    private String visitorUsername;  // 방문자의 이름 또는 ID
    private LocalDateTime visitTime; // 방문 시간

    // 기본 생성자
    public Visitor() {}

    public Visitor(UserAccount user, String visitorUsername) {
        this.user = user;
        this.visitorUsername = visitorUsername;
        this.visitTime = LocalDateTime.now();
    }
}
