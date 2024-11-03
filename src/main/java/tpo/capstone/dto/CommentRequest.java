package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {

    /**
     * 댓글 내용
     */
    private String content;

    /**
     * 댓글 작성자의 userId
     */
    private String author;
}