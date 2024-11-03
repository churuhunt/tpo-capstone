package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.UserActivity;

import java.util.List;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    // 특정 사용자들의 최신 활동을 가져오는 메서드
    @Query("SELECT ua FROM UserActivity ua WHERE ua.user.id IN :userIds ORDER BY ua.activityDate DESC")
    List<UserActivity> findRecentActivitiesByUserIds(@Param("userIds") List<Long> userIds);

    // 특정 사용자의 활동을 최근 순으로 가져오는 메서드
    @Query("SELECT ua FROM UserActivity ua WHERE ua.user.id = :userId ORDER BY ua.activityDate DESC")
    List<UserActivity> findByUserIdOrderByActivityDateDesc(@Param("userId") Long userId);
}