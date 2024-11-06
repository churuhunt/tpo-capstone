package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.dto.ReportRequest;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.entity.Comment;
import tpo.capstone.service.CommentService;
import tpo.capstone.dto.CommentRequest;


@Slf4j
@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * 댓글 작성 API
     * @param postId 게시글 ID
     * @param commentRequest 댓글 요청 DTO
     * @param userAccountDto 인증된 사용자 정보
     * @return 생성된 댓글 객체
     */
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Comment> createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal UserAccountDto userAccountDto
    ) {
        String userId = userAccountDto.getUserId(); // JWT에서 추출한 사용자 ID
        try {
            Comment comment = commentService.saveComment(postId, commentRequest.getContent(), userId);
            log.info("댓글 작성 성공: postId={}, userId={}", postId, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            log.error("댓글 작성 실패: postId={}, userId={}, 오류={}", postId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * 댓글 추천 API
     * @param commentId 댓글 ID
     * @param userAccountDto 인증된 사용자 정보
     */
    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<String> likeComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserAccountDto userAccountDto
    ) {
        String userId = userAccountDto.getUserId();
        try {
            commentService.likeComment(commentId, userId);
            log.info("댓글 추천 성공: commentId={}, userId={}", commentId, userId);
            return ResponseEntity.ok("댓글 추천 성공");
        } catch (Exception e) {
            log.error("댓글 추천 실패: commentId={}, userId={}, 오류={}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("댓글 추천 실패: " + e.getMessage());
        }
    }

    /**
     * 댓글 비추천 API
     * @param commentId 댓글 ID
     * @param userAccountDto 인증된 사용자 정보
     */
    @PostMapping("/comments/{commentId}/dislike")
    public ResponseEntity<String> dislikeComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserAccountDto userAccountDto
    ) {
        String userId = userAccountDto.getUserId();
        try {
            commentService.dislikeComment(commentId, userId);
            log.info("댓글 비추천 성공: commentId={}, userId={}", commentId, userId);
            return ResponseEntity.ok("댓글 비추천 성공");
        } catch (Exception e) {
            log.error("댓글 비추천 실패: commentId={}, userId={}, 오류={}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("댓글 비추천 실패: " + e.getMessage());
        }
    }

    /**
     * 댓글 신고 처리 API
     * @param commentId 댓글 ID
     * @param userAccountDto 인증된 사용자 정보
     * @return 신고 처리 결과 메시지
     */
    @PostMapping("/comments/{commentId}/report")
    public ResponseEntity<String> reportComment(
            @PathVariable Long commentId,
            @RequestBody ReportRequest reportRequest,
            @AuthenticationPrincipal UserAccountDto userAccountDto
    ) {
        String userId = userAccountDto.getUserId();
        try {
            // 신고 사유를 추가로 전달
            commentService.reportComment(commentId, userId, reportRequest.getReason());
            log.info("댓글 신고 성공: commentId={}, userId={}", commentId, userId);
            return ResponseEntity.ok("댓글 신고가 접수되었습니다.");
        } catch (Exception e) {
            log.error("댓글 신고 실패: commentId={}, userId={}, 오류={}", commentId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("댓글 신고 실패: " + e.getMessage());
        }
    }

}