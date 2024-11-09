package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.entity.Post;
import tpo.capstone.service.BookmarkService;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    // 북마크한 게시글 조회
    @GetMapping()
    public ResponseEntity<List<Post>> getBookmarkedPosts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            System.out.println("Error: userDetails is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        if (userAccountDto == null) {
            System.out.println("Error: userAccountDto is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = userAccountDto.getId();
        if (userId == null) {
            System.out.println("Error: userId is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            List<Post> bookmarkedPosts = bookmarkService.getBookmarkedPosts(userId);
            return ResponseEntity.ok(bookmarkedPosts);
        } catch (Exception e) {
            System.out.println("Error retrieving bookmarked posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 북마크 추가/삭제 (토글)
    @PostMapping("/toggle/{postId}")
    public ResponseEntity<?> toggleBookmark(@PathVariable Long postId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserAccountDto userAccountDto = userDetails.getUserAccountDto();
        Long userId = userAccountDto.getId(); // 인증된 사용자 ID 가져오기
        bookmarkService.toggleBookmark(userId, postId);
        return ResponseEntity.ok("북마크가 업데이트되었습니다.");
    }
}