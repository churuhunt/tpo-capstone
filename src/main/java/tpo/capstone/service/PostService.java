package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.Report;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.ReportRepository;
import tpo.capstone.repository.UserAccountRepository;

import java.util.*;


@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserAccountRepository userAccountRepository;
    private final ReportRepository reportRepository;

    @Autowired
    public PostService(PostRepository postRepository, UserAccountRepository userAccountRepository, ReportRepository reportRepository) {
        this.postRepository = postRepository;
        this.userAccountRepository = userAccountRepository;
        this.reportRepository = reportRepository;
    }

    @Transactional
    public Post savePost(Post post, String userId) {
        UserAccount author = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId")); // 유효한 사용자 확인
        post.setAuthor(author); // Author 설정
        post.setDate(new Date()); // 현재 날짜로 설정
        Post savedPost = postRepository.save(post); // 게시물 저장

        // 사용자 포인트 업데이트
        author.setPoints(author.getPoints() + 10); // 글 작성 시 10포인트 증가
        userAccountRepository.save(author);

        return savedPost;
    }

    /**
     * 게시물 추천 기능.
     * @param postId 추천할 게시물 ID
     * @param userId 추천하는 사용자 ID
     */
    @Transactional
    public void likePost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        UserAccount user = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));

        // 추천이 중복되지 않도록 처리
        if (!post.getLikedUsers().contains(user)) {
            post.setLikes(post.getLikes() + 1);
            post.getLikedUsers().add(user);

            // 추천 수가 10 이상인 경우 카테고리를 인기게시판으로 변경
            if (post.getLikes() >= 10 && !"인기게시판".equals(post.getCategory())) {
                post.setCategory("인기게시판");
            }
            postRepository.save(post);
        }
    }

    /**
     * 게시물 비추천 기능.
     * @param postId 비추천할 게시물 ID
     * @param userId 비추천하는 사용자 ID
     */
    @Transactional
    public void dislikePost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        UserAccount user = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));

        // 비추천이 중복되지 않도록 처리
        if (!post.getDislikedUsers().contains(user)) {
            post.setDislikes(post.getDislikes() + 1);
            post.getDislikedUsers().add(user);

            // 비추천 수가 10 이상이면 게시글을 블라인드 처리
            if (post.getDislikes() >= 10) {
                post.setBlind(true);
            }
            postRepository.save(post);
        }
    }

    /**
     * 게시물 조회 기능.
     * @param postId 조회할 게시물 ID
     * @param userId 조회하는 사용자 ID
     * @return 조회된 게시물 객체
     */
    public Post getPost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        // 블라인드 처리된 게시물일 경우 추가 확인 필요
        if (post.isBlind()) {
            log.warn("블라인드된 게시물입니다. 추가 확인이 필요합니다.");
        }

        return post;
    }

    /**
     * 추천 수가 10 이상인 인기 게시물 목록 조회.
     * @return 추천 수가 10 이상인 게시물 목록
     */
    public List<Post> getPopularPosts() {
        return postRepository.findByLikesGreaterThanEqual(10);
    }

    /**
     * 카테고리와 검색어에 따라 필터링된 게시물 목록 조회.
     * @param category 게시물 카테고리
     * @param searchTerm 검색어
     * @param pageable 페이징 정보
     * @return 필터링된 게시물 페이지
     */
    public Page<Post> getFilteredPosts(String category, String searchTerm, Pageable pageable) {
        if (category != null && searchTerm != null) {
            return postRepository.findByCategoryAndTitleContaining(category, searchTerm, pageable);
        } else if (category != null) {
            return postRepository.findByCategory(category, pageable);
        } else if (searchTerm != null) {
            return postRepository.findByTitleContaining(searchTerm, pageable);
        } else {
            return postRepository.findAll(pageable);
        }
    }

    /**
     * 게시물 신고 처리 메서드.
     * @param postId 신고할 게시물 ID
     * @param userId 신고하는 사용자 ID
     * @param reason 신고 사유
     */
    public void reportPost(Long postId, String userId, String reason) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        Report report = Report.builder()
                .reporter(userId)
                .targetType("POST")
                .targetId(postId)
                .reason(reason)
                .reportedAt(new Date())
                .build();

        reportRepository.save(report);
    }

    /**
     * 특정 사용자가 작성한 게시물 목록 조회.
     * @param userId 사용자 ID
     * @return 사용자가 작성한 게시물 목록
     */
    public List<Post> getUserPosts(Long userId) {
        return postRepository.findByAuthor_Id(userId);
    }

    /**
     * 특정 사용자가 작성한 카테고리별 게시물 목록 조회.
     * @param userId 사용자 ID
     * @param category 카테고리
     * @return 사용자가 작성한 특정 카테고리의 게시물 목록
     */
    public List<Post> getUserPostsByCategory(Long userId, String category) {
        return postRepository.findByAuthor_IdAndCategory(userId, category);
    }
}