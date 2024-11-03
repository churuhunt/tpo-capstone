package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // 지연 로딩 및 필수 값 설정
    @JoinColumn(name = "user_id", nullable = false) // 외래 키 이름 명시
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // 지연 로딩 및 필수 값 설정
    @JoinColumn(name = "post_id", nullable = false) // 외래 키 이름 명시
    private Post post;

    @Column(nullable = false, length = 50) // 활동 타입 필수 값 및 길이 제한 설정
    private String activityType; // 예: "click" 또는 "view"

    @Column(nullable = false) // 활동 발생 시간 필수 값 설정
    private LocalDateTime activityDate;

    // 매개변수 있는 생성자
    public UserActivity(UserAccount user, Post post, String activityType, LocalDateTime activityDate) {
        this.user = user;
        this.post = post;
        this.activityType = activityType;
        this.activityDate = activityDate;
    }
}