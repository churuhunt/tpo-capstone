package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.dto.PostDto;
import tpo.capstone.dto.ReportRequest;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.service.PostService;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.service.UserAccountService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
@Slf4j
public class PostController {

    private final PostService postService;
    private final UserAccountService userAccountService;
    private final PagedResourcesAssembler<PostDto> pagedResourcesAssembler;

    @Autowired
    public PostController(PostService postService, UserAccountService userAccountService, PagedResourcesAssembler<PostDto> pagedResourcesAssembler) {
        this.postService = postService;
        this.userAccountService = userAccountService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getFilteredPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "date") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Post> filteredPosts = postService.getFilteredPosts(category, searchTerm, pageable);
        List<PostDto> postDtoList = filteredPosts.stream()
                .map(PostDto::fromEntity) // Post 엔티티를 PostDto로 변환
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postDtoList); // 여기서 author와 category 정보가 포함됨
        response.put("currentPage", filteredPosts.getNumber());
        response.put("totalItems", filteredPosts.getTotalElements());
        response.put("totalPages", filteredPosts.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/posts")
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto, @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto) {
        String userId = userDto.getUserId();
        UserAccount authorAccount = userAccountService.findByUserId(userId);
        Post savedPost = postService.savePost(postDto.toEntity(authorAccount), userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(PostDto.fromEntity(savedPost));
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId, @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto) {
        String userId = userDto.getUserId();
        postService.likePost(postId, userId);
        return ResponseEntity.ok("게시물이 추천되었습니다.");
    }

    @PostMapping("/posts/{postId}/dislike")
    public ResponseEntity<String> dislikePost(@PathVariable Long postId, @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto) {
        String userId = userDto.getUserId();
        postService.dislikePost(postId, userId);
        return ResponseEntity.ok("게시물이 비추천되었습니다.");
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId, @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto) {
        String userId = userDto.getUserId();
        Post post = postService.getPost(postId, userId);
        return ResponseEntity.ok(PostDto.fromEntity(post));
    }

    @GetMapping("/posts/notices")
    public ResponseEntity<Page<PostDto>> getNotices(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostDto> notices = postService.getFilteredPosts("공지사항", null, pageable)
                .map(PostDto::fromEntity);
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/main")
    public ResponseEntity<Map<String, Object>> getMainPagePosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();

        List<PostDto> popularPosts = postService.getPopularPosts().stream()
                .map(PostDto::fromEntity)
                .toList();
        response.put("popularPosts", popularPosts);

        Page<PostDto> notices = postService.getFilteredPosts("공지사항", null, PageRequest.of(page, size))
                .map(PostDto::fromEntity);
        response.put("notices", notices.getContent());
        response.put("totalNotices", notices.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/posts/{postId}/report")
    public ResponseEntity<String> reportPost(@PathVariable Long postId, @RequestBody ReportRequest reportRequest, @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto) {
        String userId = userDto.getUserId();
        postService.reportPost(postId, userId, reportRequest.getReason());
        log.info("게시글이 신고되었습니다. postId: {}, reporterId: {}", postId, userId);
        return ResponseEntity.ok("신고가 접수되었습니다.");
    }
}
