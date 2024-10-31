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
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private NotificationService notificationService;


    @Transactional
    public Comment saveComment(Long postId, String content, String authorUserId) {
        // 게시물 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        // 댓글 작성자 조회
        UserAccount author = userAccountRepository.findByUserId(authorUserId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid author userId"));

        // 댓글 생성 및 저장
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setAuthor(author); // UserAccount 타입의 author 설정
        comment.setPost(post);
        comment.setDate(new java.util.Date());  // 현재 날짜 설정
        Comment savedComment = commentRepository.save(comment);

        // 댓글 작성자 포인트 5점 증가
        author.setPoints(author.getPoints() + 5); // 댓글 작성 시 5포인트 증가
        userAccountRepository.save(author);

        return savedComment;
    }

    // 댓글 추천 기능 추가
    @Transactional
    public void likeComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid commentId"));

        if (!comment.getLikedUsers().contains(userId)) {
            comment.setLikes(comment.getLikes() + 1);
            comment.getLikedUsers().add(userId);
            commentRepository.save(comment);
        }
    }

    // 댓글 비추천 기능 추가
    @Transactional
    public void dislikeComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid commentId"));

        if (!comment.getDislikedUsers().contains(userId)) {
            comment.setDislikes(comment.getDislikes() + 1);
            comment.getDislikedUsers().add(userId);

            if (comment.getDislikes() >= 10) {
                comment.setBlind(true);
            }

            commentRepository.save(comment);
        }
    }

    // 댓글 신고 처리
    public void reportComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid commentId"));

        // 신고 기록 저장
        Report report = Report.builder()
                .reporter(userId)
                .targetType("COMMENT")
                .targetId(commentId)
                .reason("댓글 신고") // 신고 사유를 받을 수 있습니다.
                .reportedAt(new Date())
                .build();

        reportRepository.save(report);
    }


    public void addComment(Post post, Comment comment) {
        // 댓글 저장 로직
        String message = post.getTitle() + "에 댓글이 달렸습니다.";
        notificationService.createNotification(post.getAuthor(), post, NotificationType.COMMENT, message);
    }

    public void addReply(Comment parentComment, Comment reply) {
        // 대댓글 저장 로직
        String message = parentComment.getContent() + "에 대댓글이 달렸습니다.";
        notificationService.createNotification(parentComment.getAuthor(), parentComment.getPost(), NotificationType.REPLY, message);
    }
}