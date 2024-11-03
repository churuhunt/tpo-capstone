package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.repository.CommentRepository;
import tpo.capstone.repository.PostRepository;

import java.util.Map;

@Service
public class UserActivityService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    public Map<String, Long> getActivityStatistics(Long userId) {
        long postCount = postRepository.countByUserId(userId);
        long commentCount = commentRepository.countByUserId(userId);
        long likesReceived = postRepository.countTotalLikesByUserId(userId); // 구현 필요
        long dislikesReceived = postRepository.countTotalDislikesByUserId(userId); // 구현 필요

        return Map.of(
                "postCount", postCount,
                "commentCount", commentCount,
                "likesReceived", likesReceived,
                "dislikesReceived", dislikesReceived
        );
    }
}