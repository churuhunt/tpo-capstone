package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.entity.Post;
import tpo.capstone.service.BookmarkService;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    // 북마크한 게시글 조회
    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getBookmarkedPosts(@PathVariable Long userId) {
        List<Post> bookmarkedPosts = bookmarkService.getBookmarkedPosts(userId);
        return ResponseEntity.ok(bookmarkedPosts);
    }

    // 북마크 추가/삭제 (토글)
    @PostMapping("/{userId}/toggle/{postId}")
    public ResponseEntity<?> toggleBookmark(@PathVariable Long userId, @PathVariable Long postId) {
        bookmarkService.toggleBookmark(userId, postId);
        return ResponseEntity.ok("북마크가 업데이트되었습니다.");
    }
}
