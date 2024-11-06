package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.service.*;

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

    @Autowired
    public MyHomeController(UserProfileService userProfileService,
                            UserActivityService userActivityService,
                            BookmarkService bookmarkService,
                            VisitorService visitorService,
                            TimelineService timelineService,
                            PostService postService) {
        this.userProfileService = userProfileService;
        this.userActivityService = userActivityService;
        this.bookmarkService = bookmarkService;
        this.visitorService = visitorService;
        this.timelineService = timelineService;
        this.postService = postService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(@AuthenticationPrincipal UserAccountDto userAccountDto) {
        Long userId = userAccountDto.getId();
        log.info("Fetching profile for userId: {}", userId);
        UserProfile userProfile = userProfileService.getProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfile> updateProfile(@AuthenticationPrincipal UserAccountDto userAccountDto, @RequestBody UserProfile profile) {
        Long userId = userAccountDto.getId();
        log.info("Updating profile for userId: {}", userId);
        UserProfile updatedProfile = userProfileService.updateProfile(userId, profile);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/activity")
    public ResponseEntity<Map<String, Long>> getActivityStatistics(@AuthenticationPrincipal UserAccountDto userAccountDto) {
        Long userId = userAccountDto.getId();
        log.info("Fetching activity statistics for userId: {}", userId);
        Map<String, Long> activityStatistics = userActivityService.getActivityStatistics(userId);
        return ResponseEntity.ok(activityStatistics);
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<Post>> getBookmarks(@AuthenticationPrincipal UserAccountDto userAccountDto) {
        Long userId = userAccountDto.getId();
        log.info("Fetching bookmarks for userId: {}", userId);
        List<Post> bookmarks = bookmarkService.getBookmarkedPosts(userId);
        return ResponseEntity.ok(bookmarks);
    }

    @PostMapping("/add-visitor")
    public ResponseEntity<Void> addVisitor(@AuthenticationPrincipal UserAccountDto userAccountDto, @RequestParam String visitorUsername) {
        Long userId = userAccountDto.getId();
        log.info("Adding visitor: {} for userId: {}", visitorUsername, userId);
        visitorService.addVisitor(userId, visitorUsername);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/visitor-count")
    public ResponseEntity<Long> getVisitorCount(@AuthenticationPrincipal UserAccountDto userAccountDto) {
        Long userId = userAccountDto.getId();
        log.info("Fetching visitor count for userId: {}", userId);
        Long visitorCount = visitorService.getVisitorCount(userId);
        return ResponseEntity.ok(visitorCount);
    }

    @GetMapping("/timeline")
    public ResponseEntity<List<UserActivity>> getTimeline(@AuthenticationPrincipal UserAccountDto userAccountDto) {
        Long userId = userAccountDto.getId();
        log.info("Fetching timeline for userId: {}", userId);
        List<UserActivity> timeline = timelineService.getUserTimeline(userId);
        return ResponseEntity.ok(timeline);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getUserPosts(@AuthenticationPrincipal UserAccountDto userAccountDto) {
        Long userId = userAccountDto.getId();
        log.info("Fetching posts for userId: {}", userId);
        List<Post> userPosts = postService.getUserPosts(userId);
        return ResponseEntity.ok(userPosts);
    }

    @GetMapping("/posts/{category}")
    public ResponseEntity<List<Post>> getUserPostsByCategory(@AuthenticationPrincipal UserAccountDto userAccountDto, @PathVariable String category) {
        Long userId = userAccountDto.getId();
        log.info("Fetching posts for userId: {} in category: {}", userId, category);
        List<Post> userPostsByCategory = postService.getUserPostsByCategory(userId, category);
        return ResponseEntity.ok(userPostsByCategory);
    }
}