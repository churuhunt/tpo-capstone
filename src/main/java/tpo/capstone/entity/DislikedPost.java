/*
package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disliked_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DislikedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount userAccount; // 비추천한 사용자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post; // 비추천받은 게시물

    */
/*@Temporal(TemporalType.TIMESTAMP)
    private Date dislikedDate; // 비추천한 날짜*//*


    // 추가적으로 필요한 메서드나 로직을 여기에 추가
}*/
