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

    private String title;
    private String content;
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private UserAccount author;
    private int views;
    private int likes;
    private int dislikes = 0; // 비추천 수 초기값 0

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    private boolean isBlind = false; // 블라인드 여부 초기값 false

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

  /*  @ElementCollection
    @CollectionTable(name = "post_liked_users", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_id")
    private Set<String> likedUsers = new HashSet<>(); // 추천한 사용자 목록

    @ElementCollection
    @CollectionTable(name = "post_disliked_users", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_id")
    private Set<String> dislikedUsers = new HashSet<>(); // 비추천한 사용자 목록

}*/