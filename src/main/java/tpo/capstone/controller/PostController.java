package tpo.capstone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tpo.capstone.dto.PostDto;
import tpo.capstone.dto.ReportRequest;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.service.PostService;
import tpo.capstone.service.S3Service;
import tpo.capstone.service.UserAccountService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
@Slf4j
public class PostController {

    private final PostService postService;
    private final UserAccountService userAccountService;
    private final S3Service s3Service;
    private final ObjectMapper objectMapper;

    @Autowired
    public PostController(PostService postService, UserAccountService userAccountService, S3Service s3Service, ObjectMapper objectMapper) {
        this.postService = postService;
        this.userAccountService = userAccountService;
        this.s3Service = s3Service;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getFilteredPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String smallCategory,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "date") String sortBy, // 정렬 기준 필드
            @RequestParam(defaultValue = "desc") String direction // 정렬 방향 추가
    ) {
        log.info("Received getFilteredPosts request with category={}, smallCategory={}, searchTerm={}, page={}, size={}, sortBy={}, direction={}",
                category, smallCategory, searchTerm, page, size, sortBy, direction);

        // 정렬 기준 필드와 방향을 동적으로 설정
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // 필터링된 게시물 가져오기 (소카테고리 포함)
        Page<Post> filteredPosts = postService.getFilteredPosts(category, smallCategory, searchTerm, pageable);
        List<PostDto> postDtoList = filteredPosts.stream()
                .map(PostDto::fromEntity)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postDtoList);
        response.put("currentPage", filteredPosts.getNumber());
        response.put("totalItems", filteredPosts.getTotalElements());
        response.put("totalPages", filteredPosts.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/posts", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<PostDto> createPost(
            @RequestParam("postDto") String postDtoString,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto) throws IOException {

        log.info("Received createPost request with postDtoString={}, imageFile provided={}",
                postDtoString, imageFile != null);

        // 주입받은 ObjectMapper 사용
        PostDto postDto = objectMapper.readValue(postDtoString, PostDto.class);
        String userId = userDto.getUserId();
        log.info("User ID extracted from token: {}", userId);

        UserAccount authorAccount = userAccountService.findByUserId(userId);

        // 이미지 파일이 있을 경우 S3에 업로드
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = s3Service.uploadImage(imageFile);
            postDto.setImageUrl(imageUrl); // S3 URL을 DTO에 설정
        }

        // 저장 시 소카테고리 정보 포함
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
        Page<PostDto> notices = postService.getFilteredPosts("공지사항", null, null, PageRequest.of(page, size))
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

        Page<PostDto> notices = postService.getFilteredPosts("공지사항", null, null, PageRequest.of(page, size))
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
