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
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final FollowRepository followRepository;
    private final UserActivityRepository userActivityRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PostRepository postRepository;
    private final WeatherService weatherService;

    @Autowired
    public RecommendationService(FollowRepository followRepository, UserActivityRepository userActivityRepository,
                                 JwtTokenProvider jwtTokenProvider, PostRepository postRepository, WeatherService weatherService) {
        this.followRepository = followRepository;
        this.userActivityRepository = userActivityRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.postRepository = postRepository;
        this.weatherService = weatherService;
    }

    /**
     * 사용자 팔로잉과 활동을 기반으로 추천 게시글을 생성.
     * @param jwtToken 사용자 인증을 위한 JWT 토큰
     * @return 추천 게시글 목록
     */
    public List<Post> recommendForUser(String jwtToken) {
        Long userId = jwtTokenProvider.getUserIdFromToken(jwtToken);

        // 팔로잉 중인 사용자의 ID와 팔로워 수 계산
        Map<Long, Integer> followerCounts = getFollowerCounts(followRepository.findByFollower_Id(userId));

        // 팔로워 활동 데이터를 기반으로 가중치 합산 후 추천 게시글 생성
        List<Long> recommendedPostIds = userActivityRepository.findRecentActivitiesByUserIds(new ArrayList<>(followerCounts.keySet()))
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

        return postRepository.findAllById(recommendedPostIds);
    }

    /**
     * 날씨 및 계절을 기반으로 게시글을 추천.
     * @param ip 사용자 IP 주소
     * @return 날씨와 계절에 적합한 추천 게시글 목록
     */
    public List<Post> recommendPostsBasedOnWeatherAndSeason(String ip) {
        String city = weatherService.getLocationFromIP(ip);
        String weatherDescription = weatherService.getWeatherByCity(city);
        String[] keywords = getKeywordsBasedOnWeatherAndSeason(weatherDescription);

        return postRepository.findAll().stream()
                .filter(post -> containsKeyword(post, keywords))
                .collect(Collectors.toList());
    }

    /**
     * 날씨와 계절에 맞는 키워드 집합을 반환.
     * @param weatherDescription 날씨 설명
     * @return 날씨에 따른 추천 키워드 배열
     */
    private String[] getKeywordsBasedOnWeatherAndSeason(String weatherDescription) {
        if (weatherDescription.contains("clear") || weatherDescription.contains("sunny")) {
            return new String[]{"봄", "산책", "야외 활동", "맑음", "가을"};
        } else if (weatherDescription.contains("rain") || weatherDescription.contains("shower")) {
            return new String[]{"비", "우산", "장마", "실내 활동", "가을"};
        } else if (weatherDescription.contains("snow")) {
            return new String[]{"겨울", "눈", "따뜻한 옷", "스키"};
        } else if (weatherDescription.contains("hot") || weatherDescription.contains("heat")) {
            return new String[]{"여름", "더위", "해변", "수영"};
        } else if (weatherDescription.contains("cold") || weatherDescription.contains("cool")) {
            return new String[]{"겨울", "추위", "따뜻한 옷", "실내 활동"};
        } else if (weatherDescription.contains("wind") || weatherDescription.contains("breezy")) {
            return new String[]{"바람", "선선함", "가을", "산책"};
        } else {
            return new String[]{"기타", "실내 활동", "여유"};
        }
    }

    /**
     * 게시글이 주어진 키워드를 포함하는지 확인.
     * @param post 게시글 객체
     * @param keywords 추천 키워드 배열
     * @return 게시글이 키워드를 포함하는지 여부
     */
    private boolean containsKeyword(Post post, String[] keywords) {
        return Arrays.stream(keywords)
                .anyMatch(keyword -> post.getContent().contains(keyword) || post.getTitle().contains(keyword));
    }

    /**
     * 활동의 가중치를 계산.
     * @param activity 사용자 활동 객체
     * @param followerCounts 팔로워 수 맵
     * @return 계산된 가중치
     */
    private int calculateWeight(UserActivity activity, Map<Long, Integer> followerCounts) {
        int baseWeight = getActivityWeight(activity.getActivityType());

        int likeCount = activity.getPost().getLikes();
        if (likeCount >= 10) {
            baseWeight += (likeCount / 5);
        }

        int followerCount = followerCounts.getOrDefault(activity.getUser().getId(), 0);
        baseWeight += (followerCount / 10);

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

    /**
     * 활동 타입에 따른 기본 가중치 반환.
     * @param activityType 활동 타입 (클릭, 조회 등)
     * @return 기본 가중치
     */
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

    /**
     * 팔로워의 ID를 기반으로 팔로워 수를 계산.
     * @param follows 팔로워 목록
     * @return 팔로워 ID별 팔로워 수 맵
     */
    private Map<Long, Integer> getFollowerCounts(List<Follow> follows) {
        return follows.stream()
                .collect(Collectors.toMap(
                        follow -> follow.getFollowing().getId(),
                        follow -> followRepository.countByFollowing(follow.getFollowing()),
                        Integer::sum
                ));
    }
}