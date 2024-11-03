package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class UserActivityData {

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
    private String activityType;

    @Column(length = 100) // 날씨 키워드의 길이 제한 설정
    private String weatherKeywords;

    @Column(length = 100) // 계절 키워드의 길이 제한 설정
    private String seasonKeywords;

    @Column(nullable = false) // 활동 날짜 필수 값 설정
    private LocalDateTime activityDate;
}