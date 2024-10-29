package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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


@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    // 인기 게시물 (추천수가 10 이상) 가져오기
    @GetMapping("/posts/popular")
    public List<Post> getPopularPosts() {
        return postService.getPopularPosts();
    }

    // 카테고리 및 검색어로 게시물 필터링 (페이징 포함)
    @GetMapping("/posts")
    public Page<Post> getFilteredPosts(
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

        return postService.getFilteredPosts(category, searchTerm, pageable);
    }

    // 게시물 작성 (JWT 토큰에서 사용자 정보 추출)
    @PostMapping("/posts")
    public Post createPost(@RequestBody Post post, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername(); // JWT에서 추출한 사용자 ID
        return postService.savePost(post, userId); // 작성자 정보 전달
    }

    // 게시물 추천
    @PostMapping("/posts/{postId}/like")
    public void likePost(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        postService.likePost(postId, userId);
    }

    // 게시물 비추천
    @PostMapping("/posts/{postId}/dislike")
    public void dislikePost(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        postService.dislikePost(postId, userId);
    }

    // 블라인드 처리된 게시글 조회
    @GetMapping("/posts/{postId}")
    public Post getPost(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        return postService.getPost(postId, userId);
    }

    /*// 메인 화면 데이터 가져오기 (공지사항 및 인기 게시물)
    @GetMapping("/main")
    public Map<String, Object> getMainPageData(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return postService.getMainPageData(page, size);
    }
*/

    // 공지사항 가져오기
    @GetMapping("/posts/notices")
    public Page<Post> getNotices(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postService.getFilteredPosts("공지사항", null, pageable);
    }

    // 메인페이지용 API 엔드포인트
    @GetMapping("/main")
    public Map<String, Object> getMainPagePosts(
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

        return response;
    }

    // 게시글 신고 처리
    @PostMapping("/posts/{postId}/report")
    public ResponseEntity<String> reportPost(@PathVariable Long postId, @RequestBody ReportRequest reportRequest, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername();
        postService.reportPost(postId, userId, reportRequest.getReason());
        return ResponseEntity.ok("신고가 접수되었습니다.");
    }
}

