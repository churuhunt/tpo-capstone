package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Follow;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.repository.FollowRepository;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.repository.UserActivityRepository;
import tpo.capstone.security.JwtTokenProvider;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PostRepository postRepository;

    public List<Post> recommendForUser(String jwtToken) {
        Long userId = jwtTokenProvider.getUserIdFromToken(jwtToken);

        // 1. 팔로잉 중인 사용자의 ID 목록과 팔로워 수를 가져오기
        Map<Long, Integer> followerCounts = getFollowerCounts(followRepository.findByFollower_Id(userId));

        // 2. 팔로워들의 활동 데이터를 조회하고 가중치 합산
        List<Long> recommendedPostIds = userActivityRepository.findTopPostsByUserIds(new ArrayList<>(followerCounts.keySet()))
                .stream()
                .collect(Collectors.groupingBy(
                        activity -> activity.getPost().getId(),
                        Collectors.summingInt(activity -> calculateWeight(activity, followerCounts))
                ))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // 3. 추천 게시글을 찾고 반환
        return postRepository.findAllById(recommendedPostIds);
    }

    // 활동 유형, 인기 게시물 여부, 팔로워 수, 활동 시간에 따라 가중치를 적용하는 함수
    private int calculateWeight(UserActivity activity, Map<Long, Integer> followerCounts) {
        int baseWeight = getActivityWeight(activity.getActivityType());

        // 인기 게시물 가중치 적용 (추천 수 비율로)
        int likeCount = activity.getPost().getLikes();
        if (likeCount >= 10) {
            baseWeight += (likeCount / 5); // 추천 수가 10 이상일 때 5당 1 가중치 추가
        }

        // 팔로워 수 가중치 적용
        int followerCount = followerCounts.getOrDefault(activity.getUser().getId(), 0);
        baseWeight += (followerCount / 10);

        // 활동 시간 가중치 적용
        long daysSinceActivity = ChronoUnit.DAYS.between(activity.getActivityDate(), LocalDateTime.now());
        if (daysSinceActivity <= 1) {
            baseWeight += 5;
        } else if (daysSinceActivity <= 7) {
            baseWeight += 3;
        } else if (daysSinceActivity <= 30) {
            baseWeight += 1;
        }

        return baseWeight;
    }

    // 활동 유형별 기본 가중치 설정
    private int getActivityWeight(String activityType) {
        switch (activityType) {
            case "click":
                return 3;
            case "view":
                return 1;
            case "like":
                return 2;
            case "comment":
                return 5;
            case "share":
                return 6;
            default:
                return 0;
        }
    }

    // 각 팔로워의 팔로워 수를 계산하는 메서드
    private Map<Long, Integer> getFollowerCounts(List<Follow> follows) {
        return follows.stream()
                .collect(Collectors.toMap(
                        follow -> follow.getFollowing().getId(),
                        follow -> followRepository.countByFollowing(follow.getFollowing()),
                        Integer::sum
                ));
    }
}