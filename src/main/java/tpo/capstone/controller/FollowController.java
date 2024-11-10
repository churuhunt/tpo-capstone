package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.dto.UserAccountDto;
import tpo.capstone.service.FollowService;

@Slf4j
@RestController
@RequestMapping("/api")
public class FollowController {

    private final FollowService followService;

    @Autowired
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    /**
     * 사용자가 다른 사용자를 팔로우합니다.
     * @param userAccountDto 인증된 사용자 정보
     * @param followingId 팔로우할 대상 사용자 ID
     * @return 팔로우 성공 여부 메시지
     */
    @PostMapping("/follow")
    public ResponseEntity<String> follow(@AuthenticationPrincipal UserAccountDto userAccountDto, @RequestParam Long followingId) {
        try {
            followService.follow(userAccountDto.getUserId(), followingId);
            log.info("팔로우 성공: followingId = {}, followerId = {}", followingId, userAccountDto.getUserId());
            return ResponseEntity.ok("팔로우 성공");
        } catch (Exception e) {
            log.error("팔로우 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("팔로우 실패: " + e.getMessage());
        }
    }

    /**
     * 사용자가 다른 사용자를 언팔로우합니다.
     * @param userAccountDto 인증된 사용자 정보
     * @param followingId 언팔로우할 대상 사용자 ID
     * @return 언팔로우 성공 여부 메시지
     */
    @DeleteMapping("/unfollow")
    public ResponseEntity<String> unfollow(@AuthenticationPrincipal UserAccountDto userAccountDto, @RequestParam Long followingId) {
        try {
            followService.unfollow(userAccountDto.getUserId(), followingId);
            log.info("언팔로우 성공: followingId = {}, followerId = {}", followingId, userAccountDto.getUserId());
            return ResponseEntity.ok("언팔로우 성공");
        } catch (Exception e) {
            log.error("언팔로우 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("언팔로우 실패: " + e.getMessage());
        }
    }
}