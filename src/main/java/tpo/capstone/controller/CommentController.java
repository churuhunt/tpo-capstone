package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.entity.Comment;
import tpo.capstone.service.CommentService;
import tpo.capstone.dto.CommentRequest;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 댓글 작성 API
    @PostMapping("/posts/{postId}/comments")
    public Comment createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userId = userDetails.getUsername(); // JWT에서 추출한 사용자 ID
        return commentService.saveComment(postId, commentRequest.getContent(), userId);
    }

    // 댓글 추천
    @PostMapping("/comments/{commentId}/like")
    public void likeComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        commentService.likeComment(commentId, userId);
    }

    // 댓글 비추천
    @PostMapping("/comments/{commentId}/dislike")
    public void dislikeComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userId = userDetails.getUsername();
        commentService.dislikeComment(commentId, userId);
    }

    // 댓글 신고 처리
    @PostMapping("/comments/{commentId}/report")
    public ResponseEntity<String> reportComment(@PathVariable Long commentId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        commentService.reportComment(commentId, userId);
        return ResponseEntity.ok("댓글 신고가 접수되었습니다.");
    }
}