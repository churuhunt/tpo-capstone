package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false) // 지연 로딩 및 필수 값 설정
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Column(length = 500) // 프로필 이미지 URL 길이 제한 설정
    private String profileImageUrl;

    @Column(length = 500) // 배경 이미지 URL 길이 제한 설정
    private String backgroundImageUrl;

    @Column(length = 255) // 닉네임 꾸미기 필드 길이 제한 설정
    private String nicknameDecoration;

    @Column(length = 1000) // 자기소개 필드 길이 제한 설정
    private String introduction;

    @Column(length = 1000) // 관심사 필드 길이 제한 설정
    private String interests;
}
