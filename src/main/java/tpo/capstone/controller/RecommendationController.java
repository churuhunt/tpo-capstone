package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tpo.capstone.entity.Post;
import tpo.capstone.service.RecommendationService;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> recommendPosts(@RequestHeader("Authorization") String jwtToken) {
        List<Post> recommendedPosts = recommendationService.recommendForUser(jwtToken);
        return ResponseEntity.ok(recommendedPosts);
    }
}
