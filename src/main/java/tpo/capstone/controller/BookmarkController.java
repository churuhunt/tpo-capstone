package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.entity.Post;
import tpo.capstone.service.BookmarkService;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    // 북마크한 게시글 조회
    @GetMapping
    public ResponseEntity<List<Post>> getBookmarkedPosts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId(); // 인증된 사용자 ID 가져오기
        List<Post> bookmarkedPosts = bookmarkService.getBookmarkedPosts(userId);
        return ResponseEntity.ok(bookmarkedPosts);
    }

    // 북마크 추가/삭제 (토글)
    @PostMapping("/toggle/{postId}")
    public ResponseEntity<?> toggleBookmark(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId(); // 인증된 사용자 ID 가져오기
        bookmarkService.toggleBookmark(userId, postId);
        return ResponseEntity.ok("북마크가 업데이트되었습니다.");
    }
}