package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tpo.capstone.config.NotificationType;
import tpo.capstone.entity.Comment;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.Report;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.CommentRepository;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.ReportRepository;
import tpo.capstone.repository.UserAccountRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserAccountRepository userAccountRepository;
    private final ReportRepository reportRepository;
    private final NotificationService notificationService;

    @Autowired
    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
                          UserAccountRepository userAccountRepository, ReportRepository reportRepository,
                          NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userAccountRepository = userAccountRepository;
        this.reportRepository = reportRepository;
        this.notificationService = notificationService;
    }

    /**
     * 댓글 작성 및 저장
     *
     * @param postId 게시물 ID
     * @param content 댓글 내용
     * @param authorUserId 작성자 사용자 ID
     * @return 저장된 댓글
     */
    @Transactional
    public Comment saveComment(Long postId, String content, String authorUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        UserAccount author = userAccountRepository.findByUserId(authorUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with userId: " + authorUserId));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setAuthor(author);
        comment.setPost(post);
        comment.setDate(new Date());
        Comment savedComment = commentRepository.save(comment);

        // 댓글 작성 시 포인트 추가
        author.setPoints(author.getPoints() + 5);
        userAccountRepository.save(author);

        return savedComment;
    }


    /**
     * 댓글 추천 기능
     *
     * @param commentId 댓글 ID
     * @param userId 추천을 하는 사용자 ID
     */
    @Transactional
    public void likeComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        if (!comment.getLikedUsers().contains(userId)) {
            comment.setLikes(comment.getLikes() + 1);
            comment.getLikedUsers().add(userId);
            commentRepository.save(comment);
        }
    }

    /**
     * 댓글 비추천 기능
     *
     * @param commentId 댓글 ID
     * @param userId 비추천을 하는 사용자 ID
     */
    @Transactional
    public void dislikeComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        if (!comment.getDislikedUsers().contains(userId)) {
            comment.setDislikes(comment.getDislikes() + 1);
            comment.getDislikedUsers().add(userId);

            // 비추천 수가 10 이상인 경우 댓글을 블라인드 처리
            if (comment.getDislikes() >= 10) {
                comment.setBlind(true);
            }

            commentRepository.save(comment);
        }
    }

    /**
     * 댓글 신고 처리
     *
     * @param commentId 댓글 ID
     * @param userId 신고를 하는 사용자 ID
     * @param reason 신고 사유
     */
    public void reportComment(Long commentId, String userId, String reason) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        // 신고 기록 저장
        Report report = Report.builder()
                .reporter(userId)
                .targetType("COMMENT")
                .targetId(commentId)
                .reason(reason)
                .reportedAt(new Date())
                .build();

        reportRepository.save(report);
    }

    /**
     * 게시물에 대한 댓글 목록 조회
     * @param postId 게시물 ID
     * @return 댓글 목록
     */
    public List<Comment> getCommentsByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

        return commentRepository.findByPost(post);  // 댓글을 게시물과 연결하여 조회
    }

    /**
     * 댓글 삭제
     * @param commentId 삭제할 댓글 ID
     * @param userId 삭제하는 사용자 ID
     */
    @Transactional
    public void deleteComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        // 댓글 작성자가 아닌 경우 삭제 불가
        if (!comment.getAuthor().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인만 댓글을 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }



    /**
     * 게시물에 댓글 추가 시 알림 생성
     *
     * @param post 게시물 객체
     * @param comment 댓글 객체
     */
    public void addComment(Post post, Comment comment) {
        String message = post.getTitle() + "에 댓글이 달렸습니다.";
        notificationService.createNotification(post.getAuthor(), post, NotificationType.COMMENT, message);
    }

    /**
     * 댓글에 대댓글 추가 시 알림 생성
     *
     * @param parentComment 부모 댓글 객체
     * @param reply 대댓글 객체
     */
    public void addReply(Comment parentComment, Comment reply) {
        String message = parentComment.getContent() + "에 대댓글이 달렸습니다.";
        notificationService.createNotification(parentComment.getAuthor(), parentComment.getPost(), NotificationType.REPLY, message);
    }
}