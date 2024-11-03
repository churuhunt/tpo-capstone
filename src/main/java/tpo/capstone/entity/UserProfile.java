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

    @OneToOne
    private UserAccount user;

    private String profileImageUrl;
    private String backgroundImageUrl;
    private String nicknameDecoration; // 닉네임 꾸미기 아이템
    private String introduction;
    private String interests;

}
