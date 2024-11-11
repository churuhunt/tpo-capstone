package tpo.capstone.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "comments")
@DynamicUpdate
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;      // 게시글 제목

    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;    // 게시글 내용

    private String category;   // 게시글 카테고리 ( 자유게시판, 정보게시판 등)

    private String smallCategory; // 소카테고리 ( 패션정보, 세일정보, 기타정보 )

    private String imageUrl; // 이미지 파일 URL

    @ManyToOne
    private UserProfile userProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    private UserAccount author;

    @Transient
    private String authorNickname;

    private int views = 0;   // 조회수, 기본값 0
    private int likes = 0;   // 추천 수, 기본값 0
    private int dislikes = 0; // 비추천 수, 기본값 0

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime date;  // 작성 날짜

    private boolean isBlind = false; // 블라인드 여부, 기본값 false

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "post_liked_users",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserAccount> likedUsers = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "post_disliked_users",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserAccount> dislikedUsers = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comment> comments = new ArrayList<>(); // 댓글 리스트 추가 및 JsonManagedReference 적용
    public void incrementViews() {
        this.views += 1;
    }
}