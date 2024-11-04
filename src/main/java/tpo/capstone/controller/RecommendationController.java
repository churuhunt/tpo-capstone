package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.dto.PostDto;
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
     * @param userDetails 인증된 사용자 정보
     * @return 추천 게시물 리스트
     */
    @GetMapping("/posts")
    public ResponseEntity<List<PostDto>> recommendPosts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            // 사용자 ID를 가져옴
            String userId = userDetails.getUsername();
            List<Post> recommendedPosts = recommendationService.recommendForUser(userId);

            // Post 엔티티를 PostDto로 변환
            List<PostDto> recommendedPostDtos = recommendedPosts.stream()
                    .map(PostDto::fromEntity)
                    .toList();

            return ResponseEntity.ok(recommendedPostDtos);
        } catch (IllegalArgumentException e) {
            log.error("Invalid user provided: {}", userDetails, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            log.error("Unexpected error while fetching recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}