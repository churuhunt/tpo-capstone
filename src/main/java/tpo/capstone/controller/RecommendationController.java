package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tpo.capstone.entity.Post;
import tpo.capstone.service.RecommendationService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * 사용자에게 맞춤 게시물 추천
     * @param jwtToken Authorization 헤더에서 가져온 JWT 토큰
     * @return 추천 게시물 리스트
     */
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> recommendPosts(@RequestHeader("Authorization") String jwtToken) {
        try {
            // JWT 토큰에서 "Bearer " 제거
            String token = jwtToken.startsWith("Bearer ") ? jwtToken.substring(7) : jwtToken;
            List<Post> recommendedPosts = recommendationService.recommendForUser(token);
            return ResponseEntity.ok(recommendedPosts);
        } catch (IllegalArgumentException e) {
            log.error("Invalid token provided: {}", jwtToken, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            log.error("Unexpected error while fetching recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}