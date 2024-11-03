package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.entity.UserActivityData;
import tpo.capstone.repository.CommentRepository;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.UserActivityDataRepository;
import tpo.capstone.repository.UserActivityRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import java.util.stream.Collectors;

@Service
@Slf4j
public class UserActivityService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private UserActivityDataRepository userActivityDataRepository;

    /**
     * 사용자 활동 통계 조회
     * @param userId 사용자 ID
     * @return 사용자 활동 통계
     */
    public Map<String, Long> getActivityStatistics(Long userId) {
        long postCount = postRepository.countByAuthor_Id(userId);
        long commentCount = commentRepository.countByAuthor_Id(userId);
        long likesReceived = postRepository.countTotalLikesByAuthor_Id(userId); // 구현 필요
        long dislikesReceived = postRepository.countTotalDislikesByAuthor_Id(userId); // 구현 필요

        return Map.of(
                "postCount", postCount,
                "commentCount", commentCount,
                "likesReceived", likesReceived,
                "dislikesReceived", dislikesReceived
        );
    }

    /**
     * 사용자 활동 저장
     * @param user 사용자 객체
     * @param post 게시물 객체
     * @param activityType 활동 타입 (예: 클릭, 조회 등)
     */
    public void saveUserActivity(UserAccount user, Post post, String activityType) {
        UserActivity activity = new UserActivity(user, post, activityType, LocalDateTime.now());
        userActivityRepository.save(activity);
    }

    // 여기부터 머신러닝 //

    /**
     * 규칙 기반 추천 메서드
     * @param content 추천을 위한 게시물 콘텐츠
     * @return 추천 게시물 리스트
     */
    public List<Post> getRuleBasedRecommendations(String content) {
        String weatherKeyword = extractWeatherKeywords(content);
        String seasonKeyword = extractSeasonKeywords(content);

        // 키워드 기반으로 추천 게시글 필터링
        return postRepository.findAll().stream()
                .filter(post -> post.getContent().contains(weatherKeyword) || post.getContent().contains(seasonKeyword))
                .collect(Collectors.toList());
    }

    /**
     * 날씨 키워드 추출 로직
     * @param content 게시물 콘텐츠
     * @return 추출된 날씨 키워드
     */
    private String extractWeatherKeywords(String content) {
        if (matchesPattern(content, "(장마|소나기|폭우|폭설|눈 내리는)")) {
            if (content.contains("비") || content.contains("장마") || content.contains("소나기")) {
                return "비";
            } else if (content.contains("눈") || content.contains("폭설") || matchesPattern(content, "눈 내리는")) {
                return "눈";
            }
        } else if (matchesPattern(content, "(맑은 날|화창한 날|햇빛|따뜻한)")) {
            return "맑음";
        } else if (matchesPattern(content, "(더운 날|폭염|열대야)")) {
            return "더위";
        } else if (matchesPattern(content, "(추운 날|한파|쌀쌀한 날)")) {
            return "추위";
        } else {
            return "기타";
        }
        return "기타";
    }

    /**
     * 계절 키워드 추출 로직
     * @param content 게시물 콘텐츠
     * @return 추출된 계절 키워드
     */
    private String extractSeasonKeywords(String content) {
        if (matchesPattern(content, "(봄|벚꽃|꽃놀이|새싹)")) {
            return "봄";
        } else if (matchesPattern(content, "(여름|해변|물놀이|무더위|피서)")) {
            return "여름";
        } else if (matchesPattern(content, "(가을|단풍|쌀쌀한 날|낙엽)")) {
            return "가을";
        } else if (matchesPattern(content, "(겨울|눈사람|눈 덮인|스키장)")) {
            return "겨울";
        } else {
            return "기타";
        }
    }

    /**
     * 정규 표현식으로 특정 패턴이 포함되었는지 확인
     * @param content 게시물 콘텐츠
     * @param pattern 정규 표현식 패턴
     * @return 패턴이 포함되었는지 여부
     */
    private boolean matchesPattern(String content, String pattern) {
        Pattern compiledPattern = Pattern.compile(pattern);
        Matcher matcher = compiledPattern.matcher(content);
        return matcher.find();
    }

    /**
     * 키워드와 함께 사용자 활동 저장
     * @param user 사용자 객체
     * @param post 게시물 객체
     * @param activityType 활동 타입
     */
    public void saveActivityWithKeywords(UserAccount user, Post post, String activityType) {
        UserActivity activity = new UserActivity(user, post, activityType, LocalDateTime.now());
        userActivityRepository.save(activity);

        collectDataForRecommendation(user, post, activityType);
    }

    /**
     * 추천을 위한 사용자 활동 데이터 수집
     * @param user 사용자 객체
     * @param post 게시물 객체
     * @param activityType 활동 타입
     */
    private void collectDataForRecommendation(UserAccount user, Post post, String activityType) {
        String weatherKeywords = extractWeatherKeywords(post.getContent());
        String seasonKeywords = extractSeasonKeywords(post.getContent());

        UserActivityData activityData = new UserActivityData();
        activityData.setUser(user);
        activityData.setPost(post);
        activityData.setActivityType(activityType);
        activityData.setWeatherKeywords(weatherKeywords);
        activityData.setSeasonKeywords(seasonKeywords);
        activityData.setActivityDate(LocalDateTime.now());

        // 데이터베이스에 저장
        userActivityDataRepository.save(activityData);
    }
}