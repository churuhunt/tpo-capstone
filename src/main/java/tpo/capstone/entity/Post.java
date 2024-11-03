package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@DynamicUpdate
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;      // 게시글 제목
    private String content;    // 게시글 내용
    private String category;   // 게시글 카테고리

    @ManyToOne(fetch = FetchType.LAZY) // 게시글 작성자 (지연 로딩을 통해 불필요한 데이터를 지연 처리)
    @JoinColumn(name = "author_id", nullable = false)
    private UserAccount author;

    private int views = 0;   // 조회수, 기본값 0
    private int likes = 0;   // 추천 수, 기본값 0
    private int dislikes = 0; // 비추천 수, 기본값 0

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;  // 작성 날짜

    private boolean isBlind = false; // 블라인드 여부, 기본값 false

    // 추천한 사용자 목록
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "post_liked_users",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserAccount> likedUsers = new HashSet<>();

    // 비추천한 사용자 목록
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "post_disliked_users",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserAccount> dislikedUsers = new HashSet<>();
}