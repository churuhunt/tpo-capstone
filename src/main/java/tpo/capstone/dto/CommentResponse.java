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
    private Long authorId; // Long 타입으로 변경
    private String authorNickname;
    private String authorProfileImageUrl;
    private Date date;
    private int likes;
    private int dislikes;
    private boolean isBlind;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorId = comment.getAuthor().getId(); // authorUserId를 authorId로 변경하고 Long id 값 사용
        this.authorNickname = comment.getAuthor().getNickname();
        this.authorProfileImageUrl = comment.getAuthor().getProfileImageUrl();
        this.date = comment.getDate();
        this.likes = comment.getLikes();
        this.dislikes = comment.getDislikes();
        this.isBlind = comment.isBlind();
    }
}