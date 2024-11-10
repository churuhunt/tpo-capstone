package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.dto.UserProfileRequestDto;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.service.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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

    @Autowired
    public MyHomeController(UserProfileService userProfileService,
                            UserActivityService userActivityService,
                            BookmarkService bookmarkService,
                            VisitorService visitorService,
                            TimelineService timelineService,
                            PostService postService,
                            S3Service s3Service) {
        this.userProfileService = userProfileService;
        this.userActivityService = userActivityService;
        this.bookmarkService = bookmarkService;
        this.visitorService = visitorService;
        this.timelineService = timelineService;
        this.postService = postService;
        this.s3Service = s3Service;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserAccountDto().getId();
        log.info("Fetching profile for userId: {}", userId);
        UserProfile userProfile = userProfileService.getProfile(userId);
        return ResponseEntity.ok(userProfile);
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("배경 이미지 업로드 실패");
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<Map<String, Long>> getActivityStatistics(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId();
        log.info("Fetching activity statistics for userId: {}", userId);
        Map<String, Long> activityStatistics = userActivityService.getActivityStatistics(userId);
        return ResponseEntity.ok(activityStatistics);
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<Post>> getBookmarks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId();
        log.info("Fetching bookmarks for userId: {}", userId);
        List<Post> bookmarks = bookmarkService.getBookmarkedPosts(userId);
        return ResponseEntity.ok(bookmarks);
    }

    @PostMapping("/add-visitor")
    public ResponseEntity<Void> addVisitor(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam String visitorUsername) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId();
        log.info("Adding visitor: {} for userId: {}", visitorUsername, userId);
        visitorService.addVisitor(userId, visitorUsername);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/visitor-count")
    public ResponseEntity<Long> getVisitorCount(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId();
        log.info("Fetching visitor count for userId: {}", userId);
        Long visitorCount = visitorService.getVisitorCount(userId);
        return ResponseEntity.ok(visitorCount);
    }

    @GetMapping("/timeline")
    public ResponseEntity<List<UserActivity>> getTimeline(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId();
        log.info("Fetching timeline for userId: {}", userId);
        List<UserActivity> timeline = timelineService.getUserTimeline(userId);
        return ResponseEntity.ok(timeline);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getUserPosts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId();
        log.info("Fetching posts for userId: {}", userId);
        List<Post> userPosts = postService.getUserPosts(userId);
        return ResponseEntity.ok(userPosts);
    }

    @GetMapping("/posts/{category}")
    public ResponseEntity<List<Post>> getUserPostsByCategory(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String category) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId();
        log.info("Fetching posts for userId: {} in category: {}", userId, category);
        List<Post> userPostsByCategory = postService.getUserPostsByCategory(userId, category);
        return ResponseEntity.ok(userPostsByCategory);
    }

    // 다른 사용자의 프로필 조회
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        log.info("Fetching profile for userId: {}", userId);
        UserProfile userProfile = userProfileService.getProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    // 다른 사용자의 활동 통계 조회
    @GetMapping("/activity/{userId}")
    public ResponseEntity<Map<String, Long>> getActivityStatistics(@PathVariable Long userId) {
        log.info("Fetching activity statistics for userId: {}", userId);
        Map<String, Long> activityStatistics = userActivityService.getActivityStatistics(userId);
        return ResponseEntity.ok(activityStatistics);
    }

    // 다른 사용자의 게시물 조회
    @GetMapping("/posts/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable Long userId) {
        log.info("Fetching posts for userId: {}", userId);
        List<Post> userPosts = postService.getUserPosts(userId);
        return ResponseEntity.ok(userPosts);
    }

    // 다른 사용자의 특정 카테고리 게시물 조회
    @GetMapping("/posts/{userId}/{category}")
    public ResponseEntity<List<Post>> getUserPostsByCategory(@PathVariable Long userId, @PathVariable String category) {
        log.info("Fetching posts for userId: {} in category: {}", userId, category);
        List<Post> userPostsByCategory = postService.getUserPostsByCategory(userId, category);
        return ResponseEntity.ok(userPostsByCategory);
    }

    // 다른 사용자의 타임라인 조회
    @GetMapping("/timeline/{userId}")
    public ResponseEntity<List<UserActivity>> getTimeline(@PathVariable Long userId) {
        log.info("Fetching timeline for userId: {}", userId);
        List<UserActivity> timeline = timelineService.getUserTimeline(userId);
        return ResponseEntity.ok(timeline);
    }

    // 다른 사용자의 방문자 수 조회
    @GetMapping("/visitor-count/{userId}")
    public ResponseEntity<Long> getVisitorCount(@PathVariable Long userId) {
        log.info("Fetching visitor count for userId: {}", userId);
        Long visitorCount = visitorService.getVisitorCount(userId);
        return ResponseEntity.ok(visitorCount);
    }

}