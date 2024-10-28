package tpo.capstone.entity;

import java.util.List;
/*import tpo.capstone.entity.LikedPost;
import tpo.capstone.entity.DislikedPost;*/
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet; //해쉬셋 추가
import java.util.Set; // 셋 추가


/** 회원 엔티티
 *
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID 자동 생성 설정
    private Long id;

    private String userId;
    private String password;
    private String name;
    private int age;
    private String gender;
    private String email;
    private String nickname;
    private int points;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastActiveDate;

    @Override
    public String toString() {
        return "UserAccount{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", points=" + points +
                '}';
    }

    /*@OneToMany(fetch = FetchType.EAGER, mappedBy = "userAccount")
    private List<LikedPost> likedPosts = new ArrayList<>();  // List 초기화

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "userAccount")
    private List<DislikedPost> dislikedPosts = new ArrayList<>(); // List 초기화*/


    @Builder
    public UserAccount(String userId, String password, String name, int age, String gender, String email, String nickname) {
        this.userId = userId;
        this.password = password;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.nickname = nickname;
        this.points = 0; // 기본 포인트 값 0 설정
    }

    public String getUsername() {
        return userId;
    }
}