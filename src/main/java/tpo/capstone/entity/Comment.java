package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String author;  // 댓글 작성자

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;  // 게시물과의 관계 설정

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;  // 댓글 작성 날짜

    private int likes = 0; // 추천 수 초기값 0
    private int dislikes = 0; // 비추천 수 초기값 0

    private boolean isBlind = false; // 블라인드 여부 초기값 false

    @ElementCollection
    private Set<String> likedUsers = new HashSet<>(); // 추천한 사용자 목록

    @ElementCollection
    private Set<String> dislikedUsers = new HashSet<>(); // 비추천한 사용자 목록
}