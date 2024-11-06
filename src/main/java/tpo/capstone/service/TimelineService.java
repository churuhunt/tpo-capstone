package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.repository.UserActivityRepository;

import java.util.List;

@Service
public class TimelineService {

    private final UserActivityRepository userActivityRepository;

    @Autowired
    public TimelineService(UserActivityRepository userActivityRepository) {
        this.userActivityRepository = userActivityRepository;
    }

    /**
     * 특정 사용자의 활동 타임라인을 조회합니다.
     * @param userId 활동 타임라인을 조회할 사용자 ID
     * @return 사용자 활동 목록 (최근 순으로 정렬됨)
     */
    public List<UserActivity> getUserTimeline(Long userId) {
        // 특정 사용자의 활동을 최근 순으로 조회하여 반환합니다.
        return userActivityRepository.findByUserIdOrderByActivityDateDesc(userId);
    }
}