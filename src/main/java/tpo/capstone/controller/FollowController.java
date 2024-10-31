package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.service.FollowService;

@RestController
@RequestMapping("/api/follow")
public class FollowController {
    @Autowired
    private FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<?> follow(@RequestHeader("Authorization") String jwtToken, @RequestParam Long followingId) {
        followService.follow(jwtToken, followingId);
        return ResponseEntity.ok("팔로우 성공");
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<?> unfollow(@RequestHeader("Authorization") String jwtToken, @RequestParam Long followingId) {
        followService.unfollow(jwtToken, followingId);
        return ResponseEntity.ok("언팔로우 성공");
    }
}
