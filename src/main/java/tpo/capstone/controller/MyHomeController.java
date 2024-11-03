package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.service.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/myhome")
public class MyHomeController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private UserActivityService userActivityService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private VisitorService visitorService;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private PostService postService;

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userProfileService.getProfile(userId));
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long userId, @RequestBody UserProfile profile) {
        return ResponseEntity.ok(userProfileService.updateProfile(userId, profile));
    }

    @GetMapping("/{userId}/activity")
    public ResponseEntity<Map<String, Long>> getActivityStatistics(@PathVariable Long userId) {
        return ResponseEntity.ok(userActivityService.getActivityStatistics(userId));
    }

    @GetMapping("/{userId}/bookmarks")
    public ResponseEntity<List<Post>> getBookmarks(@PathVariable Long userId) {
        return ResponseEntity.ok(bookmarkService.getBookmarkedPosts(userId));
    }

    @PostMapping("/{userId}/add-visitor")
    public ResponseEntity<Void> addVisitor(@PathVariable Long userId, @RequestParam String visitorUsername) {
        visitorService.addVisitor(userId, visitorUsername);
        return ResponseEntity.ok().build();
    }

    // 방문자 수 조회
    @GetMapping("/{userId}/visitor-count")
    public ResponseEntity<Long> getVisitorCount(@PathVariable Long userId) {
        return ResponseEntity.ok(visitorService.getVisitorCount(userId));
    }

    // 타임라인 조회
    @GetMapping("/{userId}/timeline")
    public ResponseEntity<List<UserActivity>> getTimeline(@PathVariable Long userId) {
        return ResponseEntity.ok(timelineService.getUserTimeline(userId));
    }

    // 사용자 게시글 조회
    @GetMapping("/{userId}/posts")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    // 특정 카테고리의 사용자 게시글 조회
    @GetMapping("/{userId}/posts/{category}")
    public ResponseEntity<List<Post>> getUserPostsByCategory(@PathVariable Long userId, @PathVariable String category) {
        return ResponseEntity.ok(postService.getUserPostsByCategory(userId, category));
    }
}