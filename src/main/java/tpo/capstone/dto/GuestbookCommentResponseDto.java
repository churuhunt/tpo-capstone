package tpo.capstone.dto;

import lombok.*;
import tpo.capstone.entity.GuestbookComment;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Builder 패턴 추가
public class GuestbookCommentResponseDto {
    private Long id;
    private String name;
    private String content;
    private String date;
    private String profileImageUrl;

    // 엔티티에서 DTO로 변환하는 메서드
    public static GuestbookCommentResponseDto fromEntity(GuestbookComment comment) {
        return GuestbookCommentResponseDto.builder()
                .id(comment.getId())
                .name(comment.getName())
                .content(comment.getContent())
                .profileImageUrl(comment.getProfileImageUrl())
                .date(new SimpleDateFormat("yyyy-MM-dd").format(comment.getDate())) // Date를 String으로 변환
                .build();
    }
}