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
import tpo.capstone.entity.UserProfile;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.ReportRepository;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.repository.UserProfileRepository;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;


@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserAccountRepository userAccountRepository;
    private final ReportRepository reportRepository;
    private final UserProfileRepository userProfileRepository;

    @Autowired
    public PostService(PostRepository postRepository,
                       UserAccountRepository userAccountRepository,
                       ReportRepository reportRepository,
                       UserProfileRepository userProfileRepository) {
        this.postRepository = postRepository;
        this.userAccountRepository = userAccountRepository;
        this.reportRepository = reportRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional
    public Post savePost(Post post, String userId) {
        log.info("Saving post with title={}, content={}, userId={}, category={}, smallCategory={}",
                post.getTitle(), post.getContent(), userId, post.getCategory(), post.getSmallCategory());

        UserAccount author = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));

        // UserProfile 가져오기
        UserProfile userProfile = userProfileRepository.findByUser_Id(author.getId())
                .orElseThrow(() -> new IllegalArgumentException("UserProfile not found for userId: " + userId));

        post.setUserProfile(userProfile);
        post.setDate(OffsetDateTime.now(ZoneOffset.UTC));
        Post savedPost = postRepository.save(post);

        // 포인트 추가 및 lastActiveDate 업데이트
        author.setPoints(author.getPoints() + 10);
        author.setLastActiveDate(new Date());
        userAccountRepository.save(author);

        log.info("Post saved with ID={} by userId={}", savedPost.getId(), userId);

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

        if (!post.getLikedUsers().contains(user)) {
            post.setLikes(post.getLikes() + 1);
            post.getLikedUsers().add(user);

            // 인기 게시판으로 변경
            if (post.getLikes() >= 10 && !"인기게시판".equals(post.getCategory())) {
                post.setCategory("인기게시판");
            }
            postRepository.save(post);

            // lastActiveDate 업데이트
            user.setLastActiveDate(new Date());
            userAccountRepository.save(user);
        }
    }

    @Transactional
    public void dislikePost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        UserAccount user = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));

        if (!post.getDislikedUsers().contains(user)) {
            post.setDislikes(post.getDislikes() + 1);
            post.getDislikedUsers().add(user);

            // 블라인드 처리
            if (post.getDislikes() >= 10) {
                post.setBlind(true);
            }
            postRepository.save(post);

            // lastActiveDate 업데이트
            user.setLastActiveDate(new Date());
            userAccountRepository.save(user);
        }
    }

    /**
     * 게시물 조회 기능.
     * @param postId 조회할 게시물 ID
     * @param userId 조회하는 사용자 ID
     * @return 조회된 게시물 객체
     */
    @Transactional
    public Post getPost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        UserAccount user = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));

        if (post.isBlind()) {
            log.warn("블라인드된 게시물입니다. 추가 확인이 필요합니다.");
        }

        // 조회수 증가 처리
        post.incrementViews();
        postRepository.save(post); // 증가된 조회수를 저장

        return post;
    }

    // 게시물 삭제
    public boolean deletePost(Long postId, String userId) {

        UserAccount user = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));

        // 게시물 존재 여부 확인
        if (postRepository.existsById(postId)) {
            postRepository.deleteById(postId); // 게시물 삭제
            return true;
        }
        return false; // 게시물이 존재하지 않으면 false 반환
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
    public Page<Post> getFilteredPosts(Long userId, List<String> category, String searchTerm, String searchMode, String sortBy, String direction, Pageable pageable) {
        log.info("Filtering posts for userId={} with category={}, searchTerm={}, pageable={}, searchMode={}, sortBy={}, direction={}",
                userId, category, searchTerm, pageable, searchMode, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        return postRepository.findFilteredPostsByUser(userId, category, searchTerm, pageable);
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