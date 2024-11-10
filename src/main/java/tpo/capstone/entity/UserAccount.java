package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

/** 회원 엔티티
 *
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    @Column(nullable = false) // 비밀번호 필수값 설정
    private String password;

    private String name;

    private int age;

    private String gender;

    @Column(unique = true, nullable = false) // 이메일 필수값 설정 및 고유 제약 조건
    private String email;

    @Column(unique = true, nullable = false) // 닉네임 필수값 설정 및 고유 제약 조건
    private String nickname;

    private int points;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastActiveDate;

    // UserProfile과의 1:1 관계 추가
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private UserProfile userProfile;

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

    @Builder
    public UserAccount(String userId, String password, String name, int age, String gender, String email, String nickname) {
        this.userId = userId;
        this.password = password;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.nickname = nickname;
        this.points = 0;
    }

    // UserDetails 인터페이스 메서드 구현
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return this.userId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}