package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.dto.GuestbookCommentResponseDto;
import tpo.capstone.dto.PostDto;
import tpo.capstone.dto.UserProfileDto;
import tpo.capstone.dto.UserProfileRequestDto;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.service.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/myhome")
public class MyHomeController {

    private final UserProfileService userProfileService;
    private final UserActivityService userActivityService;
    private final BookmarkService bookmarkService;
    private final VisitorService visitorService;
    private final TimelineService timelineService;
    private final PostService postService;
    private final S3Service s3Service;
    private final GuestbookService guestbookService;


    @Autowired
    public MyHomeController(UserProfileService userProfileService,
                            UserActivityService userActivityService,
                            BookmarkService bookmarkService,
                            VisitorService visitorService,
                            TimelineService timelineService,
                            PostService postService,
                            S3Service s3Service,
                            GuestbookService guestbookService) {
        this.userProfileService = userProfileService;
        this.userActivityService = userActivityService;
        this.bookmarkService = bookmarkService;
        this.visitorService = visitorService;
        this.timelineService = timelineService;
        this.postService = postService;
        this.s3Service = s3Service;
        this.guestbookService = guestbookService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching profile for userId: {}", userId);

        UserProfile userProfile = userProfileService.getProfile(userId);
        if (userProfile == null) {
            return ResponseEntity.notFound().build();
        }

        UserProfileDto userProfileDto = UserProfileDto.fromEntity(userProfile);
        log.info("User profile image URL: {}", userProfileDto.getProfileImageUrl());
        return ResponseEntity.ok(userProfileDto);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody UserProfileRequestDto profileDto) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Updating profile for userId: {}", userId);
        userProfileService.updateProfileData(userId, profileDto);
        return ResponseEntity.ok("프로필 정보가 업데이트되었습니다.");
    }

    @PostMapping("/profile/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = s3Service.uploadImage(file);
            userProfileService.updateProfileImage(userDetails.getUserAccountDto().getId(), imageUrl);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            log.error("Failed to upload profile image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로필 이미지 업로드 실패");
        }
    }

    @PostMapping("/profile/upload-background-image")
    public ResponseEntity<String> uploadBackgroundImage(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = s3Service.uploadImage(file);
            userProfileService.updateBackgroundImage(userDetails.getUserAccountDto().getId(), imageUrl);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            log.error("Failed to upload background image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("배경 이미지 업로드 실패");
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<Map<String, Long>> getActivityStatistics(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching activity statistics for userId: {}", userId);
        Map<String, Long> activityStatistics = userActivityService.getActivityStatistics(userId);
        return ResponseEntity.ok(activityStatistics);
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<PostDto>> getBookmarks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching bookmarks for userId: {}", userId);

        // bookmarkService에서 Post 엔티티 리스트를 받아와서 PostDto로 변환
        List<PostDto> bookmarks = bookmarkService.getBookmarkedPosts(userId).stream()
                .map(PostDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookmarks);
    }

    @PostMapping("/add-visitor")
    public ResponseEntity<Void> addVisitor(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam String visitorUsername) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Adding visitor: {} for userId: {}", visitorUsername, userId);
        visitorService.addVisitor(userId, visitorUsername);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/visitor-count")
    public ResponseEntity<Long> getVisitorCount(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching visitor count for userId: {}", userId);
        Long visitorCount = visitorService.getVisitorCount(userId);
        return ResponseEntity.ok(visitorCount);
    }

    @GetMapping("/timeline")
    public ResponseEntity<List<UserActivity>> getTimeline(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching timeline for userId: {}", userId);
        List<UserActivity> timeline = timelineService.getUserTimeline(userId);
        return ResponseEntity.ok(timeline);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getUserPosts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching posts for userId: {}", userId);
        List<Post> userPosts = postService.getUserPosts(userId);
        return ResponseEntity.ok(userPosts);
    }

    @GetMapping("/posts/{category}")
    public ResponseEntity<List<Post>> getUserPostsByCategory(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String category) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching posts for userId: {} in category: {}", userId, category);
        List<Post> userPostsByCategory = postService.getUserPostsByCategory(userId, category);
        return ResponseEntity.ok(userPostsByCategory);
    }

    @PostMapping("/update-profile-url")
    public ResponseEntity<String> updateProfileImageUrl(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody Map<String, String> request) {
        String imageUrl = request.get("imageUrl");
        Long userId = userDetails.getUserAccountDto().getId();
        userProfileService.updateProfileImage(userId, imageUrl);
        return ResponseEntity.ok("프로필 이미지 URL이 성공적으로 업데이트되었습니다.");
    }

    @PostMapping("/update-background-url")
    public ResponseEntity<String> updateBackgroundImageUrl(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody Map<String, String> request) {
        String imageUrl = request.get("imageUrl");
        Long userId = userDetails.getUserAccountDto().getId();
        userProfileService.updateBackgroundImage(userId, imageUrl);
        return ResponseEntity.ok("배경 이미지 URL이 성공적으로 업데이트되었습니다.");
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable Long userId) {
        log.info("👁️에러1: {}", userId);

        UserProfile userProfile = userProfileService.getProfile(userId);
        if (userProfile == null) {
            return ResponseEntity.notFound().build();
        }

        UserProfileDto userProfileDto = UserProfileDto.fromEntity(userProfile);
        log.info("🤣에러2 {}", userProfileDto.getProfileImageUrl());
        return ResponseEntity.ok(userProfileDto);
    }

    @GetMapping("/activity/{userId}")
    public ResponseEntity<Map<String, Long>> getActivityStatistics(@PathVariable(required = false) Long userId,
                                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userId == null) {
            // userId가 경로에 없을 때 인증된 사용자 ID 사용
            userId = userDetails.getUserAccountDto().getId();
        }
        log.info("Fetching activity statistics for userId: {}", userId);
        Map<String, Long> activityStatistics = userActivityService.getActivityStatistics(userId);
        return ResponseEntity.ok(activityStatistics);
    }

    // 소개글 업데이트 API
    @PutMapping("/update-introduction")
    public ResponseEntity<String> updateIntroduction(@RequestBody String introduction, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 인증된 사용자 ID를 가져옵니다.
        Long userId = userDetails.getUserAccountDto().getId();

        try {
            // 소개글을 업데이트합니다.
            userProfileService.updateIntroduction(userId, introduction);
            return ResponseEntity.ok("Introduction updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update introduction");
        }

    }


    // 방명록 댓글 목록 조회
    @GetMapping("/guestbook/comments")
    public ResponseEntity<List<GuestbookCommentResponseDto>> getGuestbookComments() {
        List<GuestbookCommentResponseDto> comments = guestbookService.getGuestbookComments();
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/guestbook/comments")
    public ResponseEntity<GuestbookCommentResponseDto> addGuestbookComment(
            @RequestBody GuestbookCommentResponseDto responseDto) {

        // SecurityContextHolder에서 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String userId = userDetails.getUserAccountDto().getUserId();
        GuestbookCommentResponseDto response = guestbookService.addGuestbookComment(responseDto, userId);
        return ResponseEntity.ok(response);
    }
}
