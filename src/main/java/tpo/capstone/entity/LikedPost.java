/*
package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "liked_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount userAccount; // 추천한 사용자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post; // 추천받은 게시물

    */
/*@Temporal(TemporalType.TIMESTAMP)
    private Date likedDate; // 추천한 날짜
*//*

    // 추가적으로 필요한 메서드나 로직을 여기에 추가
}*/
