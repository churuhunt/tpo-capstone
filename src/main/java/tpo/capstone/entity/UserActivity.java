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

    @ManyToOne
    private UserAccount user;

    @ManyToOne
    private Post post;

    private String activityType; // 예: "click" 또는 "view"

    private LocalDateTime activityDate; // 활동 발생 시간

    // 매개변수 있는 생성자
    public UserActivity(UserAccount user, Post post, String activityType, LocalDateTime activityDate) {
        this.user = user;
        this.post = post;
        this.activityType = activityType;
        this.activityDate = activityDate;
    }
}