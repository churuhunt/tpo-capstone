package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reporter; // 신고한 사용자 ID

    private String targetType; // 신고 대상 유형: 'POST' 또는 'COMMENT'
    private Long targetId; // 신고 대상 게시글 또는 댓글의 ID

    private String reason; // 신고 사유

    @Temporal(TemporalType.TIMESTAMP)
    private Date reportedAt; // 신고 날짜
}
