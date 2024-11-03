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

    @Column(nullable = false) // 필수 항목으로 지정
    private String reporter; // 신고한 사용자 ID

    @Column(nullable = false) // 필수 항목으로 지정
    private String targetType; // 신고 대상 유형: 'POST' 또는 'COMMENT'

    @Column(nullable = false) // 필수 항목으로 지정
    private Long targetId; // 신고 대상 게시글 또는 댓글의 ID

    @Column(nullable = false, length = 500) // 신고 사유는 필수이며, 길이 제한 설정
    private String reason; // 신고 사유

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false) // 필수 항목으로 지정하며 생성 이후 변경 불가
    private Date reportedAt; // 신고 날짜

    // Builder 패턴 사용을 위한 생성자 주석 유지
}
