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
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.dto.PostDto;
import tpo.capstone.dto.ReportRequest;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.repository.UserProfileRepository;
import tpo.capstone.service.PostService;
import tpo.capstone.service.S3Service;
import tpo.capstone.service.UserAccountService;

import java.io.IOException;
import java.util.Collections;
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
    private final UserProfileRepository userProfileRepository;

    @Autowired
    public PostController(PostService postService,
                          UserAccountService userAccountService,
                          S3Service s3Service,
                          ObjectMapper objectMapper,
                          UserProfileRepository userProfileRepository) {
        this.postService = postService;
        this.userAccountService = userAccountService;
        this.s3Service = s3Service;
        this.objectMapper = objectMapper;
        this.userProfileRepository = userProfileRepository;
    }

    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getFilteredPosts(
            @RequestParam(required = false) List<String> mainCategories,
            @RequestParam(required = false) List<String> smallCategories,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "title") String searchMode,
            @RequestParam(required = false) Long userId) {

        log.info("Received getFilteredPosts request with userId={}, mainCategories={}, smallCategories={}, searchTerm={}, page={}, size={}, sortBy={}, direction={}, searchMode={}",
                userId, mainCategories, smallCategories, searchTerm, page, size, sortBy, direction, searchMode);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy));

        // 필터링된 게시물 목록을 가져오기
        Page<Post> filteredPosts = postService.getFilteredPosts(userId, mainCategories, smallCategories, searchTerm, searchMode, sortBy, direction, pageable);

        // Post -> PostDto 변환
        List<PostDto> postDtoList = filteredPosts.getContent().stream()
                .map(PostDto::fromEntity)
                .collect(Collectors.toList());

        // 응답에 필요한 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("posts", postDtoList);                        // 게시물 목록
        response.put("currentPage", filteredPosts.getNumber());    // 현재 페이지 번호
        response.put("totalItems", filteredPosts.getTotalElements()); // 전체 항목 수
        response.put("totalPages", filteredPosts.getTotalPages());    // 전체 페이지 수

        return ResponseEntity.ok(response); // 응답 반환
    }
    @PostMapping(value = "/posts", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<PostDto> createPost(
            @RequestParam("postDto") String postDtoString,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto) throws IOException {

        log.info("Received createPost request with postDtoString={}, imageFile provided={}", postDtoString, imageFile != null);

        // ObjectMapper로 JSON 문자열을 PostDto로 변환
        PostDto postDto = objectMapper.readValue(postDtoString, PostDto.class);

        // userId를 userDto에서 가져오기
        String userId = userDto.getUserId();
        log.info("User ID extracted from token: {}", userId);

        // UserAccount 객체 가져오기 (방법 1 또는 방법 2)
        UserAccount author = userAccountService.findByUserId(userId);
        if (author == null) {
            throw new IllegalArgumentException("Invalid userId: " + userId);
        }

        // UserProfile 가져와서 프로필 이미지 URL 설정
        UserProfile userProfile = userProfileRepository.findByUser_Id(author.getId())
                .orElseGet(() -> {
                    // 기본 UserProfile 생성
                    UserProfile defaultProfile = new UserProfile();
                    defaultProfile.setUser(author);
                    defaultProfile.setProfileImageUrl("/path/to/default/profile/image.png");
                    userProfileRepository.save(defaultProfile);
                    return defaultProfile;
                });
        postDto.setProfileImageUrl(userProfile.getProfileImageUrl());

        // 이미지 파일이 있을 경우 S3에 업로드하고, URL을 PostDto에 설정
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = s3Service.uploadImage(imageFile);
            postDto.setImageUrl(imageUrl);
        }

        // Post 엔티티로 변환하여 저장
        Post savedPost = postService.savePost(postDto.toEntity(author), userId);
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
    public ResponseEntity<Page<PostDto>> getNotices(
            @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        List<String> mainCategories = Collections.singletonList("공지사항");
        List<String> smallCategories = null;  // 소카테고리를 null로 설정
        String searchMode = null; // 적절한 기본값 설정
        String sortBy = "date"; // 기본 정렬 기준
        String direction = "desc"; // 기본 정렬 방향

        Long userId = userDto.getId(); // 사용자 ID 추가
        Page<PostDto> notices = postService.getFilteredPosts(userId, mainCategories, smallCategories, null, searchMode, sortBy, direction, pageable)
                .map(PostDto::fromEntity);
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/main")
    public ResponseEntity<Map<String, Object>> getMainPagePosts(
            @AuthenticationPrincipal(expression = "userAccountDto") UserAccountDto userDto,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        Long userId = userDto.getId(); // 사용자 ID 추가

        List<PostDto> popularPosts = postService.getPopularPosts().stream()
                .map(PostDto::fromEntity)
                .toList();
        response.put("popularPosts", popularPosts);

        List<String> mainCategories = Collections.singletonList("공지사항");
        List<String> smallCategories = null;  // 소카테고리를 null로 설정
        String searchMode = null; // 적절한 기본값 설정
        String sortBy = "date"; // 기본 정렬 기준
        String direction = "desc"; // 기본 정렬 방향
        Page<PostDto> notices = postService.getFilteredPosts(userId, mainCategories, smallCategories, null, searchMode, sortBy, direction, PageRequest.of(page, size))
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

    // 게시물 삭제
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername(); // JWT에서 사용자 ID 추출

        // 게시물 삭제 서비스 호출
        boolean isDeleted = postService.deletePost(postId, userId); // 삭제 서비스 메소드 호출

        if (isDeleted) {
            return ResponseEntity.ok("게시물이 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시물을 찾을 수 없습니다.");
        }
    }

}