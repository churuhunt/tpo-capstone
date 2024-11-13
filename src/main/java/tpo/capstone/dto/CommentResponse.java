package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.Comment;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private String authorNickname;
    private String authorProfileImageUrl;  // 작성자 프로필 이미지 URL 추가
    private Date date;
    private int likes;
    private int dislikes;
    private boolean isBlind;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorNickname = comment.getAuthor().getNickname();
        this.authorProfileImageUrl = comment.getAuthor().getProfileImageUrl(); // 작성자의 프로필 이미지 URL 설정
        this.date = comment.getDate();
        this.likes = comment.getLikes();
        this.dislikes = comment.getDislikes();
        this.isBlind = comment.isBlind();
    }
}