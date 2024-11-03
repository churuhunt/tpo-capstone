package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.dto.ReportRequest;
import tpo.capstone.entity.Post;
import tpo.capstone.service.PostService;
import tpo.capstone.auth.CustomUserDetails;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


@Slf4j
@RestController
@RequestMapping("/api")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 인기 게시물 (추천수가 10 이상) 가져오기
    @GetMapping("/posts/popular")
    public ResponseEntity<List<Post>> getPopularPosts() {
        List<Post> popularPosts = postService.getPopularPosts();
        return ResponseEntity.ok(popularPosts);
    }

    // 카테고리 및 검색어로 게시물 필터링 (페이징 포함)
    @GetMapping("/posts")
    public ResponseEntity<Page<Post>> getFilteredPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "date") String sortBy
    ) {
        Pageable pageable;

        // sortBy가 'date'일 때 정렬 처리
        if ("date".equals(sortBy)) {
            pageable = PageRequest.of(page, size, Sort.by("date").descending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by(sortBy).descending()); // 다른 정렬 기준
        }

        Page<Post> filteredPosts = postService.getFilteredPosts(category, searchTerm, pageable);
        return ResponseEntity.ok(filteredPosts);
    }

    // 게시물 작성 (JWT 토큰에서 사용자 정보 추출)
    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername(); // JWT에서 추출한 사용자 ID
        Post savedPost = postService.savePost(post, userId); // 작성자 정보 전달
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    // 게시물 추천
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        postService.likePost(postId, userId);
        return ResponseEntity.ok("게시물이 추천되었습니다.");
    }

    // 게시물 비추천
    @PostMapping("/posts/{postId}/dislike")
    public ResponseEntity<String> dislikePost(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        postService.dislikePost(postId, userId);
        return ResponseEntity.ok("게시물이 비추천되었습니다.");
    }

    // 블라인드 처리된 게시글 조회
    @GetMapping("/posts/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        Post post = postService.getPost(postId, userId);
        return ResponseEntity.ok(post);
    }

    // 공지사항 가져오기
    @GetMapping("/posts/notices")
    public ResponseEntity<Page<Post>> getNotices(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> notices = postService.getFilteredPosts("공지사항", null, pageable);
        return ResponseEntity.ok(notices);
    }

    // 메인페이지용 API 엔드포인트
    @GetMapping("/main")
    public ResponseEntity<Map<String, Object>> getMainPagePosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();

        // 인기 게시물 가져오기
        List<Post> popularPosts = postService.getPopularPosts();
        response.put("popularPosts", popularPosts);

        // 공지사항 가져오기
        Page<Post> notices = postService.getFilteredPosts("공지사항", null, PageRequest.of(page, size));
        response.put("notices", notices.getContent());
        response.put("totalNotices", notices.getTotalElements());

        return ResponseEntity.ok(response);
    }

    // 게시글 신고 처리
    @PostMapping("/posts/{postId}/report")
    public ResponseEntity<String> reportPost(@PathVariable Long postId, @RequestBody ReportRequest reportRequest, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        postService.reportPost(postId, userId, reportRequest.getReason());
        log.info("게시글이 신고되었습니다. postId: {}, reporterId: {}", postId, userId);
        return ResponseEntity.ok("신고가 접수되었습니다.");
    }
}

